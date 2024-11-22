import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Order from "@/models/order";

export async function GET(req, context) {
  await dbConnect();
  const { orderId } = context.params; 

  try {
    const order = await Order.findById(orderId);
    
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      {
        err: "Server error. Please try again.",
      },
      {
        status: 500,
      }
    );
  }
}
