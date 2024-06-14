import axios from "axios";

export const metaInstance = axios.create({
  baseURL: "https://graph.facebook.com/v20.0",
});
