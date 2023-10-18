import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";
import * as mongoose from "npm:mongoose@7.6.3";

interface QuestionDto {
  category: {
    type: string;
  };
  format: string;
  question: string;
  correctAnswer: string;
  incorrectAnswers: Array<string>;
}

const { Schema } = mongoose;

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

export const validationSchema = z.object({
  category: z.string(),
  format: z.enum(["multiple", "boolean"]),
  question: z.string(),
  correctAnswer: z.string(),
  incorrectAnswers: z.array(z.string()),
});
