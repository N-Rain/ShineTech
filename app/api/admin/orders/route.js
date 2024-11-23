// import { NextResponse } from "next/server";
// import dbConnect from "@/utils/dbConnect";
// import Order from "@/models/order";
// import queryString from "query-string";

// export async function GET(req) {
//   await dbConnect();
//   const searchParams = queryString.parseUrl(req.url).query;
//   const { page, startDate, endDate, status, customerName } = searchParams || {}; // Lấy thêm tham số `status`
//   const pageSize = 3;
//   const currentPage = Number(page) || 1;
//   const skip = (currentPage - 1) * pageSize;

//   try {
//     // Tạo query lọc cho ngày và trạng thái
//     let query = {};
//     if (startDate) {
//       query.createdAt = { $gte: new Date(startDate) };
//     }
//     if (endDate) {
//       query.createdAt = { ...query.createdAt, $lte: new Date(endDate) };
//     }
//     if (status) {
//       query.delivery_status = status; // Lọc theo trạng thái đơn hàng
//     }
//     if (customerName) {
//       console.log("customerName", customerName);
      
//       // Lọc theo tên khách hàng, tìm kiếm không phân biệt chữ hoa thường
//       query["userId.name"] = { $regex: new RegExp(customerName, "i") };
//     }

//     const totalOrders = await Order.countDocuments(query);
//     const orders = await Order.find(query)
//       .populate("userId", "name")
//       .skip(skip)
//       .limit(pageSize)
//       .sort({ createdAt: -1 });

//     return NextResponse.json(
//       {
//         orders,
//         currentPage,
//         totalPages: Math.ceil(totalOrders / pageSize),
//       },
//       { status: 200 }
//     );
//   } catch (err) {
//     return NextResponse.json(
//       { error: err.message },
//       { status: 500 }
//     );
//   }
// }
import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Order from "@/models/order";
import User from "@/models/user"; // Đảm bảo import mô hình User
import queryString from "query-string";

export async function GET(req) {
  await dbConnect();
  const searchParams = queryString.parseUrl(req.url).query;
  const { page, startDate, endDate, status, customerName } = searchParams || {}; // Lấy thêm tham số `status`
  const pageSize = 3;
  const currentPage = Number(page) || 1;
  const skip = (currentPage - 1) * pageSize;

  try {
    // Tạo query lọc cho ngày và trạng thái
    let query = {};
    if (startDate) {
      query.createdAt = { $gte: new Date(startDate) };
    }
    if (endDate) {
      query.createdAt = { ...query.createdAt, $lte: new Date(endDate) };
    }
    if (status) {
      query.delivery_status = status; // Lọc theo trạng thái đơn hàng
    }

    // Tìm kiếm theo tên khách hàng nếu có
    if (customerName) {
      console.log("customerName", customerName);

      // Tìm kiếm User với tên khách hàng không phân biệt chữ hoa thường
      const users = await User.find({ name: { $regex: new RegExp(customerName, "i") } }).select("_id");
      
      if (users.length > 0) {
        // Nếu tìm thấy người dùng, lấy danh sách userIds và thêm vào query
        const userIds = users.map(user => user._id);
        query["userId"] = { $in: userIds };
      } else {
        // Nếu không tìm thấy người dùng, trả về kết quả trống
        return NextResponse.json({ orders: [], currentPage, totalPages: 0 }, { status: 200 });
      }
    }

    const totalOrders = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .populate("userId", "name")
      .skip(skip)
      .limit(pageSize)
      .sort({ createdAt: -1 });

    return NextResponse.json(
      {
        orders,
        currentPage,
        totalPages: Math.ceil(totalOrders / pageSize),
      },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}
