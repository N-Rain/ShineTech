import { NextResponse } from "next/server";
export async function GET(req){
    return NextResponse.json({time: new Date().toString})
}

//123456@
// mongodb+srv://bngoc1792:123456@@cluster0.6tslmh1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0