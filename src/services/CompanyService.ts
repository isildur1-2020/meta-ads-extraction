import { ICompany } from "../lib/constants";
import { Company } from "../models/Company";

export class CompanyService {
  public async findByPageId(page_id: string) {
    try {
      return await Company.findOne({ page_id });
    } catch (err: any) {
      console.log(err);
    }
  }
  public async create(payload: ICompany) {
    try {
      return await new Company(payload).save();
    } catch (err: any) {
      console.log(err);
    }
  }
}
