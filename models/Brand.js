import mongoose from "mongoose";

const BrandSchema = new mongoose.Schema(
  {
    nameFa: {
      type: String,
      required: true,
      // unique: [true, "این برند اضافه شده است"],
      trim: true,
    },
    nameEn : {
       type: String,
      required: true,
      // unique: [true, "این برند اضافه شده است"],
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    image: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Brand ||
  mongoose.model("Brand", BrandSchema);