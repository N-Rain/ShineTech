import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Product from "@/models/product";

export async function GET(req, context) {
    await dbConnect();
    
    try {
        const product = await Product.findOne({slug: context.params.slug});
        return NextResponse.json(product);
    } catch (err) {
        return NextResponse.json({ err: err.message }, { status: 500 });
    }
}