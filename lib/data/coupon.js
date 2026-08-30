import { connectDB } from '@/lib/mongodb';
import Coupon from '@/models/Coupon';



export const getCoupons = async ()=>{

    await connectDB();

    const coupons = await Coupon.find();

    return coupons.map((coupon)=>({
        _id : coupon._id.toString(),
        code : coupon.code,
        type : coupon.type,
        value : coupon.value || "",
        minPurchase : coupon.minPurchase,
        maxDiscount : coupon.maxDiscount,
        usedCount : coupon.usedCount,
        expiresAt : coupon.expiresAt,
        isActive : coupon.isActive

    }))

}





export const getCoupon = async (id)=>{
    await connectDB();

    const coupon = await Coupon.findById(id);

    return ({
        _id : coupon._id.toString(),
        code : coupon.code,
        type : coupon.type,
        value : coupon.value,
        minPurchase : coupon.minPurchase,
        usageLimit : coupon.usageLimit,
        maxDiscount : coupon.maxDiscount,
        usedCount : coupon.usedCount,
        expiresAt : coupon.expiresAt,
        isActive : coupon.isActive

    })

}