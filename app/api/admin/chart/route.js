import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Order from "@/models/order";

export async function GET(req, context) {
  await dbConnect();

  try {
    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const year = searchParams.get("year");
    const month = searchParams.get("month");

    const queryConditions = {
      status: "succeeded",
      refunded: false,
    };

    if (startDate && endDate) {
      queryConditions.createdAt = {
        $gte: new Date(startDate),
        $lt: new Date(new Date(endDate).setDate(new Date(endDate).getDate() + 1)),
      };
    } else if (year && month) {
      const startOfMonth = new Date(year, month - 1, 1);
      const endOfMonth = new Date(year, month, 0);
      queryConditions.createdAt = {
        $gte: startOfMonth,
        $lt: new Date(endOfMonth.setDate(endOfMonth.getDate() + 1)),
      };
    } else if (year) {
      const startOfYear = new Date(year, 0, 1);
      const endOfYear = new Date(year, 11, 31, 23, 59, 59);

      queryConditions.createdAt = {
        $gte: startOfYear,
        $lt: new Date(endOfYear.setDate(endOfYear.getDate() + 1)),
      };
    }

    const orders = await Order.find(queryConditions);

    const totalRevenue = orders.reduce(
      (acc, order) => acc + order.amount_captured,
      0
    );
    const successfulOrdersCount = orders.length;

    return NextResponse.json(
      {
        totalRevenue,
        successfulOrdersCount,
        orders,
      },
      { status: 200 }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}
