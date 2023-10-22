import {
  AUTH_TOKEN_QUESTIONS,
  DUPLICATE_KEY_CODE,
} from "/config/app-constants.ts";
import { QuestionFilters } from "/config/types.ts";
import { HTTPException, Hono, Logger, bearerAuth } from "/deps.ts";
import { Question, questionSchema } from "/schemas/question.ts";
import { User } from "/schemas/user.ts";

const logger = new Logger();
export const questions = new Hono();

questions.post(
  "/",
  bearerAuth({ token: AUTH_TOKEN_QUESTIONS }),
  async (ctx) => {
    try {
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
    } catch (error) {
      if (error?.message.includes(DUPLICATE_KEY_CODE)) {
        return ctx.json(
          { success: false, message: "This question already exists" },
          400
        );
      }

      return ctx.json(
        { success: false, message: error?.message },
        error?.status
      );
    }
  }
);

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

    const questions = await Question.find(
      filters,
      {},
      { limit: parseInt(limit) ?? 10, skip: skip ?? 0 }
    );

    return ctx.json({ questions, total: questions.length, success: true }, 200);
  } catch (error) {
    logger.error(error?.message);
    return ctx.json({ success: false, message: error?.message }, error?.status);
  }
});
