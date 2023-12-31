import { load } from "/deps.ts";

const env = await load();

export const PORT = env["PORT"] ?? Deno.env.get("PORT");

export const AUTH_TOKEN_USERS =
  env["AUTH_TOKEN_USERS"] ?? Deno.env.get("AUTH_TOKEN_USERS");

export const AUTH_TOKEN_QUESTIONS =
  env["AUTH_TOKEN_QUESTIONS"] ?? Deno.env.get("AUTH_TOKEN_QUESTIONS");

export const MONGODB_URI = env["MONGODB_URI"] ?? Deno.env.get("MONGODB_URI");

export const EMAIL_PASSWORD =
  env["EMAIL_PASSWORD"] ?? Deno.env.get("EMAIL_PASSWORD");

export const EMAIL_USER = env["EMAIL_USER"] ?? Deno.env.get("EMAIL_USER");

export const EMAIL_HOST = env["EMAIL_HOST"] ?? Deno.env.get("EMAIL_HOST");

export const DUPLICATE_KEY_CODE = "E11000";
