import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import { getToken } from "next-auth/jwt";
import Product from "@/models/product";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  await dbConnect();
  const _req = await req.json();
  console.log("_req in stripe checkout session api", _req);

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  try {
    const lineItems = await Promise.all(
      _req.cartItems.map(async (item) => {
        const product = await Product.findById(item._id);
        const unitAmount = product.price * 1;
        return {
          price_data: {
            currency: "vnd",
            product_data: {
              name: product.title,
              images: [product.images[0].secure_url],
            },
            unit_amount: unitAmount,
          },
          tax_rates: [process.env.STRIPE_TAX_RATE],
          quantity: item.quantity,
        };
      })
    );

    const session = await stripe.checkout.sessions.create({
      success_url: `${process.env.DOMAIN}/dashboard/user/stripe/success`,
      client_reference_id: token.user._id,
      line_items: lineItems,
      mode: "payment",
      payment_method_types: ["card"],
      payment_intent_data: {
        metadata: {
          cartItems: JSON.stringify(_req.cartItems),
          userId: token.user._id,
        },
      },
      shipping_options: [
        {
          shipping_rate: process.env.STRIPE_SHIPPING_RATE,
        },
      ],
      shipping_address_collection: {
        allowed_countries: ["VN"],
      },
      discounts: [
        {
          coupon: _req.couponCode,
        },
      ],
      customer_email: token.user.email,
    });

    return NextResponse.json(session, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      {
        err: "Server error. Please try again.",
      },
      { status: 500 }
    );
  }
}
