import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Order from "@/models/order";

// Xử lý phương thức GET
export async function GET(req, context) {
  await dbConnect();
  const { orderId } = context.params; // Lấy orderId từ params

  try {
    const order = await Order.findById(orderId);

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(order, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Server error. Please try again." },
      { status: 500 }
    );
  }
}


export async function PUT(req, context) {
  await dbConnect();
  const body = await req.json(); 
  const { orderId } = context.params; 

  try {
    const order = await Order.findByIdAndUpdate(
      orderId,
      { delivery_status: body.delivery_status },
      { new: true } 
    );

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(order, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Server error. Please try again." },
      { status: 500 }
    );
  }
}
