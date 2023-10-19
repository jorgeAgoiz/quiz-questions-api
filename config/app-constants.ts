import { load } from "https://deno.land/std@0.204.0/dotenv/mod.ts";

const env = await load();

export const PORT: string = env["PORT"];
export const AUTH_TOKEN: string = env["AUTH_TOKEN"];
export const MONGODB_URI: string = env["MONGODB_URI"];
export const RESEND_API_KEY: string = env["RESEND_API_KEY"];
