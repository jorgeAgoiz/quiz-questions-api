import { load } from "https://deno.land/std@0.204.0/dotenv/mod.ts";

const env = await load();

export const PORT: string = env["PORT"];
export const AUTH_TOKEN: string = env["AUTH_TOKEN"];
