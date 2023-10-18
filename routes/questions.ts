import { bearerAuth } from "https://deno.land/x/hono@v3.7.2/middleware/bearer-auth/index.ts";
import { HTTPException, Hono } from "https://deno.land/x/hono@v3.7.2/mod.ts";
import { AUTH_TOKEN } from "../config/app-constants.ts";
import { Question, validationSchema } from "../schemas/question.ts";

export const questions = new Hono();

questions.use("*", bearerAuth({ token: AUTH_TOKEN }));

questions.post("/", async (ctx) => {
  const body = await ctx.req.json();
  const { category, format, question, correctAnswer, incorrectAnswers } = body;

  const isValid = validationSchema.safeParse({
    category,
    format,
    question,
    correctAnswer,
    incorrectAnswers,
  });
  if (!isValid.success) {
    throw new HTTPException(412, { message: "Incorrect formats" });
  }

  const savedData = await Question.create({
    category,
    format,
    question,
    correctAnswer,
    incorrectAnswers,
  });

  console.log({ savedData });

  return ctx.json({ success: true }, 201);
});
