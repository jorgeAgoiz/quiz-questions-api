import { mongoose, z } from "/deps.ts";

interface QuestionDto {
  category: string;
  format: string;
  question: string;
  correctAnswer: string;
  incorrectAnswers: Array<string>;
}

const { Schema } = mongoose;
mongoose.pluralize(null);

const mongodbSchema = new Schema(
  {
    category: {
      type: String,
    },
    format: String,
    question: String,
    correctAnswer: String,
    incorrectAnswers: [String],
  },
  { validateBeforeSave: true }
);

export const Question = mongoose.model<QuestionDto>("Question", mongodbSchema);

export const questionSchema = z.object({
  category: z.string(),
  format: z.enum(["multiple", "boolean"]),
  question: z.string(),
  correctAnswer: z.string(),
  incorrectAnswers: z.array(z.string()),
});
