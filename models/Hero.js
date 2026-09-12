import mongoose from "mongoose";

const heroImageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true, trim: true },
    publicId: { type: String, required: true, trim: true },
    type: { type: String, default: "image" },
  },
  { _id: false },
);

const heroButtonSchema = new mongoose.Schema(
  {
    text: { type: String, required: true, trim: true },
    href: { type: String, required: true, trim: true },
  },
  { _id: false },
);

const heroSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    subtitle: { type: String, required: true, trim: true },
    image: { type: heroImageSchema, required: true },
    button: { type: heroButtonSchema, required: true },
    order: { type: Number, default: 0, min: 0 },
    isActive: { type: Boolean, default: true },
    startAt: { type: Date, default: null },
    endAt: { type: Date, default: null },
  },
  { timestamps: true },
);

// Public carousel queries filter by activation window and then order slides.
heroSchema.index({ isActive: 1, startAt: 1, endAt: 1, order: 1 });

export default mongoose.models.Hero || mongoose.model("Hero", heroSchema);
