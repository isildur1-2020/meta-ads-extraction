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
    search_terms: String,
    ad_snapshot_url: String,
    was_used: Boolean,
  },
  { timestamps: false }
);

export const Company = mongoose.model("Company", companySchema);
