import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Order from "@/models/order";
import { currentUser } from "@/utils/currentUser";

export async function GET(req) {
  await dbConnect();

  const user = await currentUser();
  const userId = user._id;

  // Lấy các query parameters từ URL
  const url = new URL(req.url);
  const year = url.searchParams.get("year");
  const month = url.searchParams.get("month");
  const day = url.searchParams.get("day");

  try {
    const matchQuery = { userId };

    // Xây dựng điều kiện lọc theo thời gian
    if (year) matchQuery["createdAt"] = { $gte: new Date(`${year}-01-01`), $lte: new Date(`${year}-12-31`) };
    if (year && month) matchQuery["createdAt"] = { $gte: new Date(`${year}-${month}-01`), $lte: new Date(`${year}-${month}-31`) };
    if (year && month && day) matchQuery["createdAt"] = { $gte: new Date(`${year}-${month}-${day}T00:00:00`), $lte: new Date(`${year}-${month}-${day}T23:59:59`) };

    const ordersByDate = await Order.aggregate([
      { $match: matchQuery }, // Áp dụng bộ lọc
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" },
            status: "$delivery_status",
          },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          date: {
            $concat: [
              { $toString: "$_id.year" },
              "-",
              { $toString: "$_id.month" },
              "-",
              { $toString: "$_id.day" },
            ],
          },
          status: "$_id.status",
          count: 1,
          _id: 0,
        },
      },
      { $sort: { date: 1 } },
    ]);

    return NextResponse.json({ data: ordersByDate }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { err: err.message },
      { status: 500 }
    );
  }
}
