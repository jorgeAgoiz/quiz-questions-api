import { AUTH_TOKEN_QUESTIONS } from "/config/app-constants.ts";
import { HTTPException, Hono, bearerAuth } from "/deps.ts";
import { Question, questionSchema } from "/schemas/question.ts";
import { User } from "/schemas/user.ts";

export const questions = new Hono();

questions.post(
  "/",
  bearerAuth({ token: AUTH_TOKEN_QUESTIONS }),
  async (ctx) => {
    const body = await ctx.req.json();
    const { category, format, question, correctAnswer, incorrectAnswers } =
      body;

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
  }
);

questions.get("/", async (ctx) => {
  const apiKey = ctx.req.header("Authorization");
  const user = await User.findOne({ apiKey });
  if (!user) {
    throw new HTTPException(401, { message: "Unauthorized" });
  }
  const questions = await Question.find();

  /**
   * @todo
   * - Añadir:
   *   - Paginación
   *   - Filtros
   */

  return ctx.json({ questions, total: questions.length, success: true }, 200);
});
