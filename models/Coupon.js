import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
   
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },
   
    type: {
      type: String,
      enum: ["fixed", "percentage"],
      required: true,
    },
    value : {
      type : Number,
      required : true,
    },
    minPurchase: {
      type: Number,
      default: 0,
      min: 0,
    },
    maxDiscount: {
      type: Number,
      default: null,
    },
    usedCount: {
      type: Number,
      default: 0,
    },
    expiresAt: {
      type: Date,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.models.Coupon || mongoose.model("Coupon", couponSchema);