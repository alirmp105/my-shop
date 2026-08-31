// models/Product.js

import mongoose from "mongoose";


const productImageSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
      trim: true,
    },

    isPrimary: {
      type: Boolean,
      default: false,
    },
  },
  {
    _id: false,
  }
);

const specificationSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      trim: true,
    },

    value: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    _id: false,
  }
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    price: {
      type: Number,
      required: true,
      min: 1,
    },

    stock: {
      type: Number,
      required: true,
      min: 0,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    brand : {
     type : mongoose.Schema.Types.ObjectId,
     ref : "Brand",
    },

    images: {
      type: [productImageSchema],
      required: true,
      validate: {
        validator: function (images) {
          return (
            images.length > 0 &&
            images.filter((image) => image.isPrimary).length === 1
          );
        },
        message:
          "محصول باید حداقل یک تصویر و دقیقاً یک تصویر اصلی داشته باشد.",
      },
    },
    views :{
      type : Number,
      default : 0,
      min : 0
    },

    specifications: {
      type: [specificationSchema],
      default: [],
    }
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Product ||
  mongoose.model("Product", productSchema);