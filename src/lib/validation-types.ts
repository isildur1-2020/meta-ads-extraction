import * as zod from "zod";
import { printErrMsg } from "./logs";
import { dateSchema } from "./schemas";

export const isValidDate = (date: string) => {
  try {
    tryValidateDate(date);
    return true;
  } catch (err: any) {
    if (!(err instanceof zod.ZodError)) return false;
    handleValidationErrors(err.errors);
    return false;
  }
};

export const tryValidateDate = (date: string) => {
  dateSchema.parse(date);
};

const handleValidationErrors = (errors: zod.ZodIssue[]) => {
  errors.map(({ message }) => {
    printErrMsg(`Input error: ${message}`);
  });
};
