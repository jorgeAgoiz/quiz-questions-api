import { bearerAuth } from "https://deno.land/x/hono@v3.7.2/middleware/bearer-auth/index.ts";
import { HTTPException, Hono } from "https://deno.land/x/hono@v3.7.2/mod.ts";
import { AUTH_TOKEN } from "../config/app-constants.ts";
import { Question, questionSchema } from "../schemas/question.ts";

export const questions = new Hono();

questions.use("*", bearerAuth({ token: AUTH_TOKEN }));

questions.post("/", async (ctx) => {
  const body = await ctx.req.json();
  const { category, format, question, correctAnswer, incorrectAnswers } = body;

  const isValid = questionSchema.safeParse({
    category,
    format,
    question,
    correctAnswer,
    incorrectAnswers,
  });
  if (!isValid.success) {
    throw new HTTPException(412, { message: "Incorrect formats" });
  }

  await Question.create({
    category,
    format,
    question,
    correctAnswer,
    incorrectAnswers,
  });

  return ctx.json({ success: true }, 201);
});

questions.get("/", async (ctx) => {
  const questions = await Question.find();

  /**
   * @todo
   * - Añadir:
   *   - Paginación
   *   - Filtros
   */

  return ctx.json({ questions, total: questions.length, success: true }, 200);
});
