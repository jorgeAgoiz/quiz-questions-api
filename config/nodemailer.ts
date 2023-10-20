import { nodemailer } from "../deps.ts";
import {
  EMAIL_HOST,
  EMAIL_PASSWORD,
  EMAIL_USER,
} from "/config/app-constants.ts";

export const transporter = nodemailer.createTransport({
  host: EMAIL_HOST,
  secure: false,
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASSWORD,
  },
});
