import * as zod from "zod";

export const dateSchema = zod.string().date();
