import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Product from "@/models/product";
import Order from "@/models/order";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  await dbConnect();
  const _raw = await req.text();
  const sig = req.headers.get("stripe-signature");

  try {
    const event = stripe.webhooks.constructEvent(
      _raw,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    console.log("Stripe Event Received:", event);

    // Handle successful payment (charge.succeeded)
    if (event.type === "charge.succeeded") {
      const chargeSucceeded = event.data.object;
      const { id, ...rest } = chargeSucceeded;

      // Check if the order already exists
      const existingOrder = await Order.findOne({ chargeId: id });
      if (existingOrder) {
        console.log("Order already exists for this charge ID:", id);
        return NextResponse.json({ ok: true });
      }

      const cartItems = JSON.parse(chargeSucceeded.metadata.cartItems);
      console.log("Parsed cartItems:", cartItems);

      const productIds = cartItems.map((item) => item._id);
      const products = await Product.find({ _id: { $in: productIds } });

      const productMap = {};
      products.forEach((product) => {
        productMap[product._id.toString()] = {
          _id: product._id,
          title: product.title,
          slug: product.slug,
          price: product.price,
          image: product.images[0]?.secure_url || "",
        };
      });

      const cartItemsWithProductDetails = cartItems.map((cartItem) => ({
        ...productMap[cartItem._id],
        quantity: cartItem.quantity,
      }));

      const orderData = {
        ...rest,
        chargeId: id,
        userId: chargeSucceeded.metadata.userId,
        cartItems: cartItemsWithProductDetails,
      };
      console.log("Order Data:", orderData);

      await Order.create(orderData).catch((error) => {
        console.log("Order Creation Error:", error);
        throw new Error("Failed to create order");
      });

      // Update stock and sold quantity for successful payments (for both user and admin)
      for (const cartItem of cartItems) {
        const product = await Product.findById(cartItem._id);
        if (product) {
          // Ensure that stock is available and then update stock and sold count
          if (product.stock >= cartItem.quantity) {
            product.stock -= cartItem.quantity; // Reduce stock
            product.sold += cartItem.quantity;  // Increase sold count
            await product.save();  // Save the updated product
            console.log(`Updated Product: ${product.title}, stock: ${product.stock}, sold: ${product.sold}`);
          } else {
            return NextResponse.json({
              error: "Not enough stock for some items",
              status: 400,
            });
          }
        }
      }

      return NextResponse.json({ ok: true });
    }

    // Handle order cancellations/refunds (charge.refunded or charge.canceled)
    if (event.type === "charge.refunded" || event.type === "charge.canceled") {
      const chargeRefunded = event.data.object;
      const { id, ...rest } = chargeRefunded;

      // Find the existing order
      const existingOrder = await Order.findOne({ chargeId: id });
      if (!existingOrder) {
        console.log("No order found for this charge ID:", id);
        return NextResponse.json({ ok: true });
      }

      // Restore stock and adjust sold quantity for refunded/canceled orders
      for (const cartItem of existingOrder.cartItems) {
        const product = await Product.findById(cartItem._id);
        if (product) {
          product.stock += cartItem.quantity;  // Increase stock back
          product.sold = Math.max(0, product.sold - cartItem.quantity);  // Ensure sold does not go below 0
          await product.save();
        }
      }

      // Update order status to "Refunded" or "Cancelled"
      existingOrder.delivery_status = event.type === "charge.refunded" ? "Refunded" : "Cancelled";
      await existingOrder.save();

      return NextResponse.json({ ok: true });
    }

    // Handle successful delivery event (payment_intent.succeeded)
    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object;
      const order = await Order.findOne({ chargeId: paymentIntent.id });

      if (order && order.delivery_status !== "Delivered") {
        // Mark as delivered and update stock/sold count
        order.delivery_status = "Delivered";
        await order.save();

        for (const cartItem of order.cartItems) {
          const product = await Product.findById(cartItem._id);
          if (product) {
            product.sold += cartItem.quantity; // Increase sold quantity
            await product.save();
          }
        }
      }

      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ message: "Unhandled event type" });
  } catch (err) {
    console.log("Error in Webhook Handling:", err);
    return NextResponse.json({
      err: "Server error. Please try again",
      status: 500,
    });
  }
}
