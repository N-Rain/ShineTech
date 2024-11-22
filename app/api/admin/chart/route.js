// import { NextResponse } from "next/server";
// import dbConnect from "@/utils/dbConnect";
// import Product from "@/models/product";
// import Category from "@/models/category";
// import Tag from "@/models/tag";
// import Order from "@/models/order";
// import Blog from "@/models/blog";

// export async function GET(req, context) {
//   await dbConnect();

//   try {
//     const totalProducts = await Product.countDocuments();
//     const totalOrders = await Order.countDocuments();
//     const totalCategories = await Category.countDocuments();
//     const totalTags = await Tag.countDocuments();
//     const totalBlogs = await Blog.countDocuments();

//     // Calculate the total count of all reviews
//     const totalReviews = await Product.aggregate([
//       {
//         $project: {
//           totalReviews: { $size: "$ratings" }, // tinh size arr rating
//         },
//       },
//       {
//         $group: {
//           _id: null,
//           totalCount: { $sum: "$totalReviews" }, // Tong cac bai danh gia tren prod
//         },
//       },
//     ]);

//     const data = [
//       {
//         label: "Products",
//         url: "/dashboard/admin/products",
//         count: totalProducts,
//       },
//       { label: "Orders", url: "/dashboard/admin/orders", count: totalOrders },
//       {
//         label: "Categories",
//         url: "/dashboard/admin/category",
//         count: totalCategories,
//       },
//       { label: "Tags", url: "/dashboard/admin/tag", count: totalTags },
//       { label: "Blogs", url: "/dashboard/admin/blog/list", count: totalBlogs },
//       {
//         label: "Reviews",
//         url: "/dashboard/admin/product/reviews",
//         count: totalReviews[0].totalCount,
//       },
//     ];

//     return NextResponse.json({ data }, { status: 200 });
//   } catch (err) {
//     console.log(err);
//     return NextResponse.json(
//       {
//         err: err.message,
//       },
//       { status: 500 }
//     );
//   }
// }
import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Order from "@/models/order";
import moment from "moment"; // Use moment.js for date formatting

export async function GET(req) {
  await dbConnect();

  try {
    const { period, type } = req.nextUrl.searchParams;

    let matchCriteria = {};

    if (type === "day" && period) {
      matchCriteria = { 
        createdAt: { 
          $gte: new Date(period),
          $lt: new Date(new Date(period).setDate(new Date(period).getDate() + 1))
        }
      };
    } else if (type === "month" && period) {
      matchCriteria = { 
        createdAt: { 
          $gte: new Date(`${period}-01`),
          $lt: new Date(`${period}-01`).setMonth(new Date(`${period}-01`).getMonth() + 1)
        }
      };
    } else if (type === "year" && period) {
      matchCriteria = { 
        createdAt: { 
          $gte: new Date(`${period}-01-01`),
          $lt: new Date(`${parseInt(period) + 1}-01-01`)
        }
      };
    } else if (type === "week" && period) { // New weekly filter
      const startOfWeek = moment(period).startOf('week').toDate();
      const endOfWeek = moment(period).endOf('week').toDate();
      
      matchCriteria = {
        createdAt: {
          $gte: startOfWeek,
          $lt: endOfWeek,
        },
      };
    }

    const orders = await Order.aggregate([
      { $match: matchCriteria },
      { $unwind: "$cartItems" },
      {
        $group: {
          _id: type === "day" ? { day: { $dayOfMonth: "$createdAt" }, month: { $month: "$createdAt" }, year: { $year: "$createdAt" }} :
               type === "month" ? { month: { $month: "$createdAt" }, year: { $year: "$createdAt" }} :
               type === "week" ? { week: { $week: "$createdAt" }, year: { $year: "$createdAt" }} :
               { year: { $year: "$createdAt" }},
          totalRevenue: { 
            $sum: { $multiply: ["$cartItems.price", "$cartItems.quantity"] },
          },
        },
      },
      // Modify the aggregation part to ensure correct label format:
{
  $project: {
    label: {
      $concat: [
        { $toString: "$_id.year" },
        type !== "year" ? "-" + { $toString: "$_id.month" } : "",
        type === "day" ? "-" + { $toString: "$_id.day" } : "",
        type === "week" ? "-W" + { $toString: "$_id.week" } : "",
      ],
    },
    totalRevenue: 1,
  },
},

      { $sort: { label: 1 } },
    ]);

    const data = orders.map((order) => ({
      label: order.label,
      totalRevenue: order.totalRevenue,
      url: `/dashboard/admin/orders?date=${order.label}`,
    }));

    return NextResponse.json({ data }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { err: err.message },
      { status: 500 }
    );
  }
}
