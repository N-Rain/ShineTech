import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Order from "@/models/order";

export async function GET(req, context) {
  await dbConnect();
  const { orderId } = context.params; // Lấy orderId từ params
  const { searchParams } = new URL(req.url);
  const customerName = searchParams.get("customerName");
  const date = searchParams.get("date");
  try {
    if (orderId) {
      const order = await Order.findById(orderId);
      if (!order) {
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
      }
      return NextResponse.json(order, { status: 200 });
    }

    const query = {};

    // Lọc theo tên khách hàng
    if (customerName) {
      query["userId.name"] = { $regex: customerName, $options: "i" }; 
    }

    // Lọc theo ngày tháng năm
    if (date) {
      const startOfDay = new Date(date);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      query["createdAt"] = { $gte: startOfDay, $lte: endOfDay };
    }

    const orders = await Order.find(query)
      .populate("userId", "name") 
      .sort({ createdAt: -1 });

    return NextResponse.json(orders, { status: 200 });
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
