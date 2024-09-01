import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Tag from "@/models/tag";
import slugify from "slugify";
export async function POST(req) {
  const body = await req.json();
  await dbConnect();

  const { name, parentCategory } = body;
  try {
    const tag = await Tag.create({
      name,
      parentCategory,
      slug: slugify(name),
    });
    return NextResponse.json(tag);
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      {
        err: err.message,
      },
      { status: 500 }
    );
  }
}
export async function GET(req) {
  await dbConnect();
  try {
    const tags = await Tag.find({}).sort({ createAt: -1 });
    return NextResponse.json(tags);
  } catch {
    console.log(err);
    return NextResponse.json(
      {
        err: "Server error. Please try again"
      },
      {
        status: 500
      }
    )
  }
}