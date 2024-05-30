import * as yargs from "yargs";
import { isValidDate } from "../lib/validation-types";

const args = yargs
  .option("since", {
    type: "string",
    demandOption: true,
    description: "Start date to extract data, YYYY-MM-DD",
  })
  .check(({ since }) => isValidDate(since))
  .option("until", {
    type: "string",
    description: "End date to extract data, YYYY-MM-DD",
    demandOption: true,
  })
  .check(({ until }) => isValidDate(until)).argv;

export default args;
