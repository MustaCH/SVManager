import { connectDB } from "@/data";
import Prod from "@/models/products";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  await connectDB();

  const products = await Prod.find();
  console.log(products);
  return NextResponse.json(products);
}

export async function POST(req: NextRequest) {
  await connectDB();
  const data = await req.json();

  const product = await Prod.create(data);
  console.log(data);
  return NextResponse.json(product);
}

export async function DELETE(req: NextRequest) {
  await connectDB();
  const data = await req.json();

  const product = await Prod.deleteOne(data);
  console.log(data);
  return NextResponse.json(product);
}
