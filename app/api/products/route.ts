import { connectDB } from "@/data";
import Prod from "@/models/products";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  await connectDB();

  const products = await Prod.find();
  return NextResponse.json(products);
}

export async function POST(req: NextRequest) {
  await connectDB();
  const data = await req.json();

  const products = await Prod.create(data);
  return NextResponse.json(products);
}
