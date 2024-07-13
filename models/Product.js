import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String },
    desc: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: mongoose.ObjectId, ref: "category", required: true },
    quantity: { type: Number, required: true },
    photo: { data: Buffer, contentType: String },
    shipping: { type: Boolean },
  },
  { timestamps: true }
);

export default mongoose.model("product", ProductSchema);
