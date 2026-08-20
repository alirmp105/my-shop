import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

import { registerSchema } from "@/schemas/auth";

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();

    // Validation سمت سرور
    const result = registerSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          message: "اطلاعات وارد شده معتبر نیست.",
          errors: result.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const {
      name,
      email,
      password,
    } = result.data;

    // بررسی وجود کاربر
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        {
          message: "کاربری با این ایمیل قبلاً ثبت شده است.",
        },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(
      password,
      12
    );

    // ایجاد User
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return NextResponse.json(
      {
        message: "ثبت‌نام با موفقیت انجام شد.",
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("REGISTER ERROR:", error);

    return NextResponse.json(
      {
        message: "خطایی هنگام ثبت‌نام رخ داد.",
      },
      { status: 500 }
    );
  }
}