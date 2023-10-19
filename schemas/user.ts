import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";
import * as mongoose from "npm:mongoose@7.6.3";

interface UserDto {
  email: string;
  admin: boolean;
  apiKey: string;
  active: boolean;
  lastAccess: string;
}

const { Schema } = mongoose;
mongoose.pluralize(null);

const mongodbSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
    },
    admin: {
      type: Boolean,
    },
    apiKey: { type: String },
    active: { type: Boolean },
    lastAccess: {
      type: Date,
    },
  },
  {
    validateBeforeSave: true,
    timestamps: true,
  }
);

export const User = mongoose.model<UserDto>("User", mongodbSchema);

export const userSchema = z.object({
  email: z.string(),
  admin: z.boolean(),
  apiKey: z.string().uuid(),
  active: z.boolean(),
  lastAccess: z.date(),
});
