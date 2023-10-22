export interface QuestionFilters {
  category?: string;
  format?: string;
}

export interface QuestionDto {
  category: string;
  format: string;
  question: string;
  correctAnswer: string;
  incorrectAnswers: Array<string>;
}

export interface UserDto {
  email: string;
  admin: boolean;
  apiKey: string;
  active: boolean;
  lastAccess: Date;
}
