import CouponList from '@/components/coupons/CouponList';
import { connectDB } from '@/lib/mongodb';
import Coupon from '@/models/Coupon';
import React from 'react';


export const getCoupon = async ()=>{

    await connectDB();

    const coupons = await Coupon.find();

    return coupons.map((coupon)=>({
        id : coupon._id,
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
const CouponPage =async () => {
    const coupons = await getCoupon();
    return (
        <div>
            <h1 className='text-3xl font-bold'>
                مدیریت تخفیف ها
            </h1>

            <CouponList coupons={coupons} />
        </div>
    );
};

export default CouponPage;