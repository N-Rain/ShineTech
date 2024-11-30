// import { NextResponse } from "next/server";
// import dbConnect from "@/utils/dbConnect";
// import Product from "@/models/product";
// import Order from "@/models/order";
// import { getToken } from "next-auth/jwt";

// export async function POST(req) {
//   await dbConnect();

//   const _req = await req.json();
//   console.log("_req in rating route", _req);

//   const { productId, rating, comment } = _req;
//   const token = await getToken({
//     req,
//     secret: process.env.NEXTAUTH_SECRET,
//   });

//   try {
//     const product = await Product.findById(productId);

//     // Check if the user has already rated the product
//     const existingRating = product.ratings.find(
//       (rate) => rate.postedBy.toString() === token.user._id.toString()
//     );

//     // Check if the user has purchased the product
//     const userPurchased = await Order.findOne({
//       userId: token.user._id,
//       "cartItems._id": productId,
//     });
//     // const userPurchased = await Order.findOne({
//     //   userId: token.user._id,
//     //   "cartItems.product": productId, // Sửa cartItems._id thành cartItems.product
//     // });
    
//     // const userPurchased = await Order.findOne({
//     //   userId: token.user._id, // ID người dùng từ token
//     //   cartItems: {
//     //     $elemMatch: {
//     //       product: productId, // ID sản phẩm
//     //     },
//     //   },
//     // });
    

//     if (!userPurchased) {
//       return NextResponse.json(
//         {
//           err: "You can only leave a review for products you've purchased.",
//         },
//         { status: 400 }
//       );
//     }

//     if (existingRating) {
//       // Update the existing rating
//       existingRating.rating = rating;
//       existingRating.comment = comment;
//       await product.save();

//       return NextResponse.json(product, { status: 200 });
//     }

//     // If the user has not already rated, add a new rating
//     product.ratings.push({
//       rating: rating,
//       postedBy: token.user._id,
//       comment: comment,
//     });
//     const updated = await product.save();

//     return NextResponse.json(updated, { status: 200 });
//   } catch (err) {
//     console.log(err);
//     return NextResponse.json(
//       {
//         err: "Server error. Please try again.",
//       },
//       { status: 500 }
//     );
//   }
// }
import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Product from "@/models/product";
import Order from "@/models/order";
import { getToken } from "next-auth/jwt";
import mongoose from "mongoose";

export async function POST(req) {
  await dbConnect();

  const _req = await req.json();
  console.log("_req in rating route", _req);

  const { productId, rating, comment } = _req;
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token) {
    return NextResponse.json(
      { err: "Authentication required" },
      { status: 401 }
    );
  }

  try {
    const product = await Product.findById(productId);

    if (!product) {
      return NextResponse.json(
        { err: "Product not found" },
        { status: 404 }
      );
    }

    // Kiểm tra trạng thái giao hàng và sản phẩm trong giỏ hàng
    const userPurchased = await Order.findOne({
      userId: token.user._id,
      "cartItems.product": new mongoose.Types.ObjectId(productId), // Chuyển sang ObjectId
      delivery_status: "Delivered", // Chỉ kiểm tra đơn hàng đã giao
    });
    console.log("Order query result:", userPurchased);
    
    if (!userPurchased) {
      console.log("No matching order found for the product and user.");
      return NextResponse.json(
        {
          err: "You can only leave a review for products you've purchased.",
        },
        { status: 400 }
      );
    }
    
    // Kiểm tra nếu người dùng đã đánh giá sản phẩm
    const existingRating = product.ratings.find(
      (rate) => rate.postedBy.toString() === token.user._id.toString()
    );

    if (existingRating) {
      // Cập nhật đánh giá nếu đã tồn tại
      existingRating.rating = rating;
      existingRating.comment = comment;
      await product.save();

      return NextResponse.json(product, { status: 200 });
    }

    // Thêm đánh giá mới nếu chưa có
    product.ratings.push({
      rating,
      postedBy: token.user._id,
      comment,
    });

    const updated = await product.save();

    return NextResponse.json(updated, { status: 200 });
  } catch (err) {
    console.error("Error:", err.message);
    return NextResponse.json(
      {
        err: "Server error. Please try again.",
      },
      { status: 500 }
    );
  }
}

