import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    Product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
    },
    title: {
      type: String,
      trim: true,
      maxLength: 100,
    },
    comment: {
      type: String,
      required: true,
      maxLength: 200,
    },
    statuse: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.models.Review || mongoose.model("Review", reviewSchema);
