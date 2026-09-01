import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import Category from "@/models/Category";




export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);

    const status = searchParams.get("status");

    const filter = {};

    if (status === "available") {
      filter.stock = { $gt: 0 };
    }

    if (status === "out") {
      filter.stock = 0;
    }

    const products = await Product.find(filter)
      .populate("category")
      .sort({ createdAt: -1 });

    return NextResponse.json( products);

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "خطا در دریافت محصولات" },
      { status: 500 }
    );
  }
}