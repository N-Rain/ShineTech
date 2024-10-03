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
      _raw, // Nội dung của request
      sig,  // Chữ ký lấy từ header
      process.env.STRIPE_WEBHOOK_SECRET
    );

    switch (event.type) {
      case "charge.succeeded":
        const chargeSucceeded = event.data.object;
        const { id, ...rest } = chargeSucceeded;

        const cartItems = JSON.parse(chargeSucceeded.metadata.cartItems)
        const productIds = cartItems.map((item) => item._id);
        const products = await Product.find({ _id: { $in: productIds } })

        const productMap = {};
        products.forEach((product) => {
          productMap[product._id.toString()] = {
            _id: product._id,
            title: product.title,
            slug: product.slug,
            price: product.price,
            image: product.images[0]?.secure_url || "",

          }
        });
        // create cartItém with product details
        const cartItemsWithProductDetails = cartItems.map(cartItem => ({
          ...productMap[cartItem._id],
          quantity: cartItem.quantity
        }));
        // create order
        const orderData = {
          ...rest,
          chargeId: id,
          userId: chargeSucceeded.metadata.userId,
          cartItems: cartItemsWithProductDetails,

        };
        await Order.create(orderData);
        for (const cartItem of cartItems) {
          const product = await Product.findById(cartItem._id)
          product.stock = product.stock - cartItem.quantity
          await product.save()
        }
        return NextResponse.json({ ok: true })
    }
  } catch (err) {
    console.log(err);
    return NextResponse.json({
      err: "Server error. Please try again",
      status: 500,
    });
  }
}