import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
// import { productSchema } from "@/schemas/ProductSchema";
import Category from "@/models/Category";
// app/api/products/route.js
import mongoose from "mongoose";
// export async function GET() {
//   try {
//     await connectDB();

//     const products = await Product.find().populate("category");

//     return NextResponse.json(
//       products.map((product) => ({
//         id: product._id.toString(),
//         name: product.name,
//         stock: product.stock,
//         category: product.category.name,
//       })),
//     );
//   } catch (error) {
//     console.error("error msg :", error);
//     return NextResponse.json(
//       { message: "failed to fetch products" },
//       { status: 500 },
//     );
//   }
// }


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