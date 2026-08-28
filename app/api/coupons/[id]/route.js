import { connectDB } from "@/lib/mongodb";
import Coupon from "@/models/Coupon";
import { couponSchema } from "@/schemas/coupon";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

function isValidId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

export async function PUT(request, { params }) {
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
    console.log("body :", body);
    const validation = couponSchema.safeParse(body);
    console.log("validation", validation);

    if (!validation.success) {
      const firstIssue = validation.error.issues[0];
      // ??
      return NextResponse.json(
        { message: firstIssue?.message || "اطلاعات ارسالی معتبر نیست" },
        { status: 400 },
      );
    }

    const data = validation.data;
    console.log("data :" , data);
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
    console.log("couopn :::" , coupon);
    


  } catch (error) {
     console.error("Update post error:", error);
        return NextResponse.json({ message: "Failed to update coupon" }, { status: 500 });
  }
}
