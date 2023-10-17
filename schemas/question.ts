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

const Schema = mongoose.Schema;

const questionSchema = new Schema({
  category: {
    type: String,
  },
  format: String,
  question: String,
  correctAnswer: String,
  incorrectAnswers: [String],
});

export const Question = mongoose.model<QuestionDto>("Question", questionSchema);
