import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Product from "@/models/product";

export async function PUT(req, context) {
  await dbConnect();

  const _req = await req.json();

  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      context.params.id,
      {
        ..._req,
      },
      {
        new: true,
      }
    );
    return NextResponse.json(updatedProduct);
  } catch (err) {
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}

export async function DELETE(req, context) {
  await dbConnect();

  try {
    const deletedProduct = await Product.findByIdAndDelete(context.params.id);
    return NextResponse.json(deletedProduct);
  } catch (err) {
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}
