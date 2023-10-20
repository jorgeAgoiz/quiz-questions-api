import { AUTH_TOKEN, EMAIL_USER } from "/config/app-constants.ts";
import { transporter } from "/config/nodemailer.ts";
import { HTTPException, Hono, Logger, bearerAuth } from "/deps.ts";
import { User, userSchema } from "/schemas/user.ts";

const logger = new Logger();
export const users = new Hono();

users.use("*", bearerAuth({ token: AUTH_TOKEN }));

users.post("/", async (ctx) => {
  const body = await ctx.req.json();
  const { email } = body;

  if (!email) {
    throw new HTTPException(400, { message: "Email is required" });
  }

  const apiKey: string = crypto.randomUUID();

  const newUser = {
    email,
    admin: false,
    apiKey,
    active: true,
    lastAccess: new Date(Date.now()),
  };

  const isValid = userSchema.safeParse(newUser);
  if (!isValid.success) {
    throw new HTTPException(412, { message: "Incorrect formats" });
  }

  await User.create(newUser);

  const result = await transporter.sendMail({
    to: email,
    from: EMAIL_USER,
    subject: "API KEY",
    html: `Tu Key para poder empezar a usar la API es: ${apiKey}`,
  });

  if (result.accepted?.length <= 0) {
    logger.error("The api key could not be sent to the email");
  }

  return ctx.json({ success: true }, 201);
});

users.post("/validate", async (ctx) => {
  const param = await ctx.req.param();

  console.log({ param });
});
