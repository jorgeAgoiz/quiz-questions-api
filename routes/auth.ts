import { bearerAuth } from "https://deno.land/x/hono@v3.7.2/middleware/bearer-auth/index.ts";
import { Hono, HTTPException } from "https://deno.land/x/hono@v3.7.2/mod.ts";
import { Resend } from "npm:resend@1.0.0";
import { AUTH_TOKEN, RESEND_API_KEY } from "../config/app-constants.ts";
import { User, userSchema } from "../schemas/user.ts";

const resend = new Resend(RESEND_API_KEY);

export const users = new Hono();

users.use("*", bearerAuth({ token: AUTH_TOKEN }));

users.post("/", async (ctx) => {
  const body = await ctx.req.json();
  const { email } = body;

  if (!email) {
    throw new HTTPException(400, { message: "Email is required" });
  }

  const newUser = {
    email,
    admin: false,
    apiKey: crypto.randomUUID(),
    active: false,
    lastAccess: new Date(Date.now()),
  };

  const isValid = userSchema.safeParse(newUser);
  if (!isValid.success) {
    throw new HTTPException(412, { message: "Incorrect formats" });
  }

  await User.create(newUser);

  /**
   * @todo
   * - Mandar email de activación API KEY
   */
  const data = await resend.emails.send({
    from: "Quiz Questions API <onboarding@resend.dev>",
    to: [email],
    subject: "hello world",
    html: "<strong>it works!</strong>",
  });

  console.log({ data });

  return ctx.json({ success: true }, 201);
});

users.post("/validate", async (ctx) => {
  const param = await ctx.req.param();

  console.log({ param });
});
