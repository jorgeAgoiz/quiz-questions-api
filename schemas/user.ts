import { UserDto } from "/config/types.ts";
import { mongoose, z } from "/deps.ts";

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
