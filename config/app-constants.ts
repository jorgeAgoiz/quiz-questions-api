import { load } from "/deps.ts";

const env = await load();

export const PORT: string = env["PORT"];
export const AUTH_TOKEN_USERS: string = env["AUTH_TOKEN_USERS"];
export const AUTH_TOKEN_QUESTIONS: string = env["AUTH_TOKEN_QUESTIONS"];
export const MONGODB_URI: string = env["MONGODB_URI"];
export const EMAIL_PASSWORD: string = env["EMAIL_PASSWORD"];
export const EMAIL_USER: string = env["EMAIL_USER"];
export const EMAIL_HOST: string = env["EMAIL_HOST"];

export const DUPLICATE_KEY_CODE = "E11000";
