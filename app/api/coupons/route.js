import Coupon from "@/models/Coupon";
import { connectDB } from "@/lib/mongodb";
import { couponSchema } from "@/schemas/coupon";
import { NextResponse } from "next/server";
export async function POST(request) {

  try {
    await connectDB();
    const body = await request.json();
    const validation = couponSchema.safeParse(body);

    if (!validation.success) {
        return NextResponse.json(
            { error: validation.error.format() },
            {message : "اطلاعات وارد شده معتبر نیستند", status: 400 },
            
        );
    }

    const data = validation.data;
    const existingCoupon = await Coupon.findOne({ code: data.code });

    if (existingCoupon) {
        return NextResponse.json(
            { error: "کد تخفیف وارد شده تکراری است" },
            { status: 400 },
        );
    }

    const coupon = await Coupon.create({
        code : data.code,
        title : data.title,
        type : data.type,
        value : data.value,
        minPurchase : data.minPurchase ?? 0,
        maxDiscount : data.maxDiscount ?? null,
        usageLimit : data.usageLimit ?? null,
        expiresAt :  data.expiresAt ?? null,
        isActive : data.isActive ?? true
    })

    return NextResponse.json({
        message : "کد با موفقیت ایجاد شد" , coupon
    }, {status : 201})

  } catch (error) {
    console.error("POST api/coupon : " , error);

    return NextResponse.json(
        { error: "خطایی در سرور رخ داده است" },
        { status: 500 },
    );
    
  }
}