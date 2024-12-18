import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import User from "@/models/user";
import bcrypt from "bcrypt";

export async function POST(req) {
  const body = await req.json();

  await dbConnect();

  try {
    const { email, password, resetCode } = body;

    // Check if user with email exists and reset code is valid
    const user = await User.findOne({
      email: email,
      "resetCode.data": resetCode,
      "resetCode.expireAt": { $gt: new Date() },
    });

    if (!user) {
      return NextResponse.json(
        {
          err: "Mã xác nhận không hợp lệ hoặc đã hết hạn. Vui lòng thử lại.",
        },
        { status: 400 }
      );
    }

    // Reset the user's password and save the updated user
    user.password = await bcrypt.hash(password, 10);
    user.resetCode = null; // Clear the reset code
    await user.save();

    // Send success response
    return NextResponse.json({
      message: "Đặt lại mật khẩu thành công. Vui lòng đăng nhập với mật khẩu mới của bạn.",
    });
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