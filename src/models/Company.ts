import { Schema, Model, model } from "mongoose";

export type ICompany = {
  page_name: string;
  page_id: string;
  ad_delivery_start_time: string;
  address?: string;
  phone?: string;
  email: string;
  website?: string;
  search_terms: string;
  ad_snapshot_url: string;
  was_used?: boolean;
};

export type CompanyModel = Model<ICompany>;

const companySchema = new Schema<ICompany, CompanyModel>(
  {
    page_name: String,
    page_id: String,
    ad_delivery_start_time: String,
    email: String,
    address: {
      type: String,
      default: null,
    },
    phone: {
      type: String,
      default: null,
    },
    website: {
      type: String,
      default: null,
    },
    search_terms: String,
    ad_snapshot_url: String,
    was_used: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const Company = model<ICompany, CompanyModel>("Company", companySchema);
