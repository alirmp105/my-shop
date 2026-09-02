import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

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

    return NextResponse.json(products);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "خطا در دریافت موجودی محصولات" },
      { status: 500 },
    );
  }
}
