import {
  EMAIL_HOST,
  EMAIL_PASSWORD,
  EMAIL_USER,
} from "/config/app-constants.ts";
import { nodemailer } from "/deps.ts";

export const transporter = nodemailer.createTransport({
  host: EMAIL_HOST,
  secure: false,
  port: 465,
  tls: {
    rejectUnauthorized: false,
  },
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASSWORD,
  },
});
