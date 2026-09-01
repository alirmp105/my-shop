import { connectDB } from "@/lib/mongodb";
import Coupon from "@/models/Coupon";
import { couponSchema } from "@/schemas/coupon";
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

function isValidId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

export async function PUT(request, { params }) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  if (session.user.role !== "admin") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;

  if (!isValidId(id)) {
    return NextResponse.json(
      {
        message: "invalid coupon id",
      },
      { status: 400 },
    );
  }

  try {
    const body = await request.json();
    const validation = couponSchema.safeParse(body);

    if (!validation.success) {
      const firstIssue = validation.error.issues[0];
      return NextResponse.json(
        { message: firstIssue?.message || "اطلاعات ارسالی معتبر نیست" },
        { status: 400 },
      );
    }

    const data = validation.data;
    await connectDB();

    const coupon = await Coupon.findByIdAndUpdate(id,data ,  { new: true, runValidators: true });
    if (!coupon) {
      return NextResponse.json(
        {
          message: "coupon not found",
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
        message : " coupon updated "

    }, {status : 200})

    


  } catch (error) {
     console.error("Update post error:", error);
        return NextResponse.json({ message: "Failed to update coupon" }, { status: 500 });
  }
}


export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    await connectDB();

    const { id } = await params;
    
  
     if (!mongoose.Types.ObjectId.isValid(id)) {
          return NextResponse.json({ message: "شناسه دسته بندی معتبر نیست" }, { status: 400 });
        }

    // پیدا کردن brand
    const coupon = await Coupon.findById(id);

    if (!coupon) {
      return NextResponse.json(
        { message: "برند پیدا نشد" },
        { status: 404 },
      );
    }

    
    await Coupon.findByIdAndDelete(id);

    //حذف فایل تصویر

    ``
  

    return NextResponse.json(
      { message: "کد تخفیف با موفقیت حذف شد" },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: "خطایی در حذف کد تخفیف رخ داد" },
      { status: 500 },
    );
  }
}
