import { bearerAuth } from "https://deno.land/x/hono@v3.7.2/middleware/bearer-auth/index.ts";
import { Hono } from "https://deno.land/x/hono@v3.7.2/mod.ts";
import { AUTH_TOKEN } from "../config/app-constants.ts";
import { Question } from "../schemas/question.ts";

export const questions = new Hono();

questions.use("*", bearerAuth({ token: AUTH_TOKEN }));

questions.use("*", async (_, next) => {
  console.log("middleware before");
  await next();
  console.log("middleware after");
});

questions.get("/", async (c) => {
  const result = await Question.create({
    category: "loquesea",
    format: "multiple",
    question: "holakease",
    correctAnswer: "epic",
    incorrectAnswers: ["si", "no"],
  });
  console.log({ result });
  return c.text("hola ke ase");
});

questions.post("/", (c) => c.text("hola ke ase"));
