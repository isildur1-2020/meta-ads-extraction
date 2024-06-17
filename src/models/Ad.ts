import mongoose from "mongoose";

const adSchema = new mongoose.Schema(
  {
    page_name: String,
    page_id: String,
    ad_delivery_start_time: String,
    address: String,
    phone: String,
    email: String,
    website: String,
  },
  { timestamps: false }
);

export const Ad = mongoose.model("Ad", adSchema);
