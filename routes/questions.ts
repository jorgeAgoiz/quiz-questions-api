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

interface QuestionFilters {
  category?: string;
  format?: string;
}

questions.get("/", async (ctx) => {
  try {
    const { page, limit, category, format } = ctx.req.query();

    const apiKey = ctx.req.header("Authorization");
    const user = await User.findOne({ apiKey, active: true });
    if (!user) {
      throw new HTTPException(401, { message: "Unauthorized" });
    }

    user.lastAccess = new Date(Date.now());
    await user.save();

    const skip: number = (parseInt(page) - 1) * parseInt(limit);
    const filters: QuestionFilters = {};

    if (category) {
      filters.category = category;
    }

    if (format) {
      filters.format = format;
    }

    console.log({ page, limit, category, format, skip });

    const questions = await Question.find(
      filters,
      { _id: 0 },
      { limit: parseInt(limit) ?? 10, skip: skip ?? 0 }
    );

    /**
     * @todo
     * - Añadir:
     *   - Paginación
     *   - Filtros
     * https://www.mongodb.com/docs/manual/reference/operator/query/rand/
     * https://www.mongodb.com/docs/manual/reference/operator/aggregation/sample/
     */

    return ctx.json({ questions, total: questions.length, success: true }, 200);
  } catch (error) {
    logger.error(error?.message);
    return ctx.json({ success: false, message: error?.message }, error?.status);
  }
});
