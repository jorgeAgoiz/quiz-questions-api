import { AUTH_TOKEN_QUESTIONS } from "/config/app-constants.ts";
import { HTTPException, Hono, Logger, bearerAuth } from "/deps.ts";
import { Question, questionSchema } from "/schemas/question.ts";
import { User } from "/schemas/user.ts";

const logger = new Logger();
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
  try {
    const apiKey = ctx.req.header("Authorization");
    const user = await User.findOne({ apiKey });
    if (!user) {
      throw new HTTPException(401, { message: "Unauthorized" });
    }

    user.lastAccess = new Date(Date.now());
    await user.save();

    const questions = await Question.find();

    /**
     * @todo
     * - Añadir:
     *   - Paginación
     *   - Filtros
     */

    return ctx.json({ questions, total: questions.length, success: true }, 200);
  } catch (error) {
    logger.error(error?.message);
    return ctx.json({ success: false, message: error?.message }, error?.status);
  }
});
