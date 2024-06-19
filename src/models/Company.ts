import mongoose from "mongoose";

const companySchema = new mongoose.Schema(
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

export const Company = mongoose.model("Company", companySchema);
