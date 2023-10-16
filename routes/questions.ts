import { Hono } from "https://deno.land/x/hono@v3.7.2/mod.ts";

export const questions = new Hono();

questions.get("/", (c) => c.text("Questions endpoint"));

questions.post("/", (c) => c.text("Insert questions"));
