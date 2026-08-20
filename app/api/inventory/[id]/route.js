import { NextResponse } from "next/server";
import mongoose from "mongoose";

import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";

export async function PATCH(req, { params }) {
  try {
    await connectDB();

    const { id } = await params;

    // بررسی معتبر بودن ID محصول
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          message: "شناسه محصول معتبر نیست.",
        },
        { status: 400 }
      );
    }

    const body = await req.json();

    const { type, quantity } = body;

    // بررسی نوع تغییر
    if (!["increase", "decrease"].includes(type)) {
      return NextResponse.json(
        {
          message: "نوع تغییر موجودی معتبر نیست.",
        },
        { status: 400 }
      );
    }

    // تبدیل و بررسی quantity
    const amount = Number(quantity);

    if (!Number.isInteger(amount) || amount <= 0) {
      return NextResponse.json(
        {
          message: "مقدار تغییر باید یک عدد صحیح مثبت باشد.",
        },
        { status: 400 }
      );
    }

    // پیدا کردن محصول
    const product = await Product.findById(id);

    if (!product) {
      return NextResponse.json(
        {
          message: "محصول پیدا نشد.",
        },
        { status: 404 }
      );
    }

    const previousStock = product.stock;

    let newStock;

    if (type === "increase") {
      newStock = previousStock + amount;
    } else {
      newStock = previousStock - amount;
    }

    // جلوگیری از موجودی منفی
    if (newStock < 0) {
      return NextResponse.json(
        {
          message: `موجودی کافی نیست. موجودی فعلی: ${previousStock}`,
        },
        { status: 400 }
      );
    }

    // تغییر موجودی
    product.stock = newStock;

    await product.save();

    return NextResponse.json(
      {
        message: "موجودی با موفقیت تغییر کرد.",
        product: {
          id: product._id.toString(),
          stock: product.stock,
        },
        previousStock,
        newStock,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("PATCH/api/inventory/[id]:", error);

    return NextResponse.json(
      {
        message: "خطایی هنگام تغییر موجودی رخ داد.",
      },
      { status: 500 }
    );
  }
}