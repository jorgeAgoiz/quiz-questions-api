import { load } from "/deps.ts";

const env = await load();

export const PORT: string = env["PORT"];
export const AUTH_TOKEN: string = env["AUTH_TOKEN"];
export const MONGODB_URI: string = env["MONGODB_URI"];
export const EMAIL_PASSWORD: string = env["EMAIL_PASSWORD"];
export const EMAIL_USER: string = env["EMAIL_USER"];
export const EMAIL_HOST: string = env["EMAIL_HOST"];
