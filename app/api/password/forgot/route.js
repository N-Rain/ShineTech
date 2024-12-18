import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import User from "@/models/user";
import randomInteger from "random-int";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.GMAIL_AUTH_USER,
    pass: process.env.GMAIL_AUTH_PASS,
  },
});

export async function POST(req) {
  const body = await req.json();

  await dbConnect();

  const { email } = body;

  // Check if user with email exists
  const user = await User.findOne({ email });

  if (!user) {
    return NextResponse.json(
      {
        err: "User not found",
      },
      { status: 400 }
    );
  }

  const resetCode = randomInteger(100000, 999999);

  // Save reset code in the user document
  user.resetCode = {
    data: resetCode,
    expireAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
  };
  await user.save();

  // Send email
  const mailOptions = {
    to: email,
    from: process.env.GMAIL_AUTH_USER,
    subject: "Password Reset Code",
    html: `
          Xin chào ${user.name},<br />
          <br />
          Bạn đã yêu cầu đặt lại mật khẩu. Vui lòng sử dụng mã sau để đặt lại mật khẩu của bạn:<br />
          <br />
          <strong>${resetCode}</strong><br />
          <br />
          Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.<br />
          <br />
          Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi,<br />
          Đội ngũ ShineTech!
      `,
  };

  try {
    // Send the email
    await transporter.sendMail(mailOptions);

    // Assuming that the email is sent successfully, send the response to the client.
    return NextResponse.json({
      message: "Kiểm tra email của bạn để lấy mã đặt lại mật khẩu.",
    });
  } catch (error) {
    console.error("Lỗi gửi mail:", error);

    // If there's an error while sending the email, return an appropriate error response.
    return NextResponse.json(
      {
        err: "Lỗi gửi email. Vui lòng thử lại sau.",
      },
      { status: 500 }
    );
  }
}