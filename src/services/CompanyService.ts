import { HydratedDocument } from "mongoose";
import { Company, ICompany } from "../models/Company";
import { Logger } from "../lib/logs";

export interface CompanyServiceImp {
  findByPageId: (page_id: string) => Promise<HydratedDocument<ICompany> | null>;
  create: (payload: ICompany) => Promise<void>;
}

export class CompanyService implements CompanyServiceImp {
  public async findByPageId(page_id: string) {
    try {
      return await Company.findOne({ page_id });
    } catch (err: any) {
      Logger.printErrMsg(`[COMPANY SERVICE]: Err\n${err}`);
      console.log(err);
      return null;
    }
  }

  public async create(payload: ICompany) {
    try {
      const companyCreated = await new Company(payload).save();
      this.printCompanyInfo(companyCreated);
    } catch (err: any) {
      Logger.printErrMsg(`[COMPANY SERVICE]: Err\n${err}`);
    }
  }

  private printCompanyInfo(data: HydratedDocument<ICompany>) {
    const { page_id, address, email, phone, website, ad_delivery_start_time } =
      data;
    Logger.printWarningMsg("-----------------------------------------------");
    Logger.printWarningMsg(`-- PAGE: ${page_id}`);
    Logger.printWarningMsg(`-- PHONE: ${phone}`);
    Logger.printWarningMsg(`-- EMAIL: ${email}`);
    Logger.printWarningMsg(`-- ADRRESS: ${address}`);
    Logger.printWarningMsg(`-- WEBSITE: ${website}`);
    Logger.printWarningMsg(`-- DELIVERY START TIME: ${ad_delivery_start_time}`);
    Logger.printWarningMsg("-----------------------------------------------");
  }
}
