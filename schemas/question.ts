import { QuestionDto } from "/config/types.ts";
import { mongoose, z } from "/deps.ts";

const { Schema } = mongoose;
mongoose.pluralize(null);

const mongodbSchema = new Schema(
  {
    category: String,
    format: String,
    question: {
      type: String,
      unique: true,
    },
    correctAnswer: String,
    incorrectAnswers: [String],
  },
  { validateBeforeSave: true }
);

export const Question = mongoose.model<QuestionDto>("Question", mongodbSchema);

export const questionSchema = z.object({
  category: z.enum([
    "geography",
    "arts&literature",
    "history",
    "entertainment",
    "science&nature",
    "sports&leisure",
  ]),
  format: z.enum(["multiple", "boolean"]),
  question: z.string(),
  correctAnswer: z.string(),
  incorrectAnswers: z.array(z.string()),
});
