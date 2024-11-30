import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Product from "@/models/product";
import Order from "@/models/order";
import { getToken } from "next-auth/jwt";

export async function POST(req) {
  await dbConnect();

  const _req = await req.json();
  const { productId, rating, comment } = _req;
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  try {
    const product = await Product.findById(productId);

    if (!product) {
      return NextResponse.json({ err: "Product not found." }, { status: 400 });
    }

    // Check if the user has already rated the product
    const existingRating = product.ratings.find(
      (rate) => rate.postedBy.toString() === token.user._id.toString()
    );

    // Check if the user has purchased the product
    console.log("Checking if user has purchased the product...");
    console.log("User ID:", token.user._id);
    console.log("Product ID:", productId);

    const userPurchased = await Order.findOne({
      userId: token.user._id,
      "cartItems._id": productId,
      delivery_status: "Delivered",
    });

    console.log("userPurchased:", userPurchased); // Log the result for debugging

    if (!userPurchased) {
      console.log("No matching order found.");
      return NextResponse.json(
        {
          err: "You can only leave a review for products you've purchased.",
        },
        { status: 400 }
      );
    }

    if (existingRating) {
      // Update the existing rating
      existingRating.rating = rating;
      existingRating.comment = comment;
      await product.save();

      return NextResponse.json(product, { status: 200 });
    }

    // If the user has not already rated, add a new rating
    product.ratings.push({
      rating: rating,
      postedBy: token.user._id,
      comment: comment,
    });

    const updated = await product.save();

    return NextResponse.json(updated, { status: 200 });
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