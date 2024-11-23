// import { NextResponse } from "next/server";
// import dbConnect from "@/utils/dbConnect";
// import Order from "@/models/order";
// import { currentUser } from "@/utils/currentUser";
// export async function GET(req) {
//   await dbConnect();
//   try {
//     const user = await currentUser();
//     // asynchronously
//     const orders = await Order.find({ userId: user._id }).sort({
//       createdAt: -1,
//     });
//     return NextResponse.json(orders);
//   }
//   catch (err) {
//     return NextResponse.json(
//       {
//         err: err.message,
//       },
//       {
//         status: 500
//       }
//     );
//   }
// }

// import { NextResponse } from "next/server";
// import dbConnect from "@/utils/dbConnect";
// import Order from "@/models/order";
// import { currentUser } from "@/utils/currentUser"; // Hàm lấy thông tin người dùng hiện tại
// import queryString from "query-string";

// export async function GET(req) {
//   await dbConnect();
//   const searchParams = queryString.parseUrl(req.url).query;
//   const { page, startDate, endDate, status } = searchParams || {}; 
//   const pageSize = 3;
//   const currentPage = Number(page) || 1;
//   const skip = (currentPage - 1) * pageSize;

//   try {
//     const user = await currentUser(); // Hàm lấy thông tin người dùng hiện tại

//     if (!user) {
//       return NextResponse.json(
//         { error: "User not found or not logged in" },
//         { status: 401 } // Trả về lỗi nếu người dùng không đăng nhập
//       );
//     }

//     // Tạo query lọc cho ngày, trạng thái và userId
//     let query = {
//       userId: user._id // Chỉ lấy các đơn hàng của người dùng hiện tại
//     };

//     if (startDate) {
//       query.createdAt = { $gte: new Date(startDate) };
//     }
//     if (endDate) {
//       query.createdAt = { ...query.createdAt, $lte: new Date(endDate) };
//     }
//     if (status) {
//       query.delivery_status = status;
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
import { currentUser } from "@/utils/currentUser"; // Hàm lấy thông tin người dùng hiện tại
import queryString from "query-string";

export async function GET(req) {
  await dbConnect();
  const searchParams = queryString.parseUrl(req.url).query;
  const { page, startDate, endDate, status } = searchParams || {}; 
  const pageSize = 3;
  const currentPage = Number(page) || 1;
  const skip = (currentPage - 1) * pageSize;

  try {
    // Lấy thông tin người dùng hiện tại từ session
    const user = await currentUser();

    if (!user) {
      return NextResponse.json(
        { error: "User not found or not logged in" },
        { status: 401 } // Trả về lỗi nếu người dùng không đăng nhập
      );
    }

    // Tạo query lọc cho ngày, trạng thái và userId
    let query = {
      userId: user.id // Chỉ lấy các đơn hàng của người dùng hiện tại
    };

    if (startDate) {
      query.createdAt = { $gte: new Date(startDate) };
    }
    if (endDate) {
      query.createdAt = { ...query.createdAt, $lte: new Date(endDate) };
    }
    if (status) {
      query.delivery_status = status;
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

