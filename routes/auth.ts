import {
  AUTH_TOKEN_USERS,
  DUPLICATE_KEY_CODE,
  EMAIL_USER,
} from "/config/app-constants.ts";
import { transporter } from "/config/nodemailer.ts";
import { HTTPException, Hono, Logger, bearerAuth } from "/deps.ts";
import { User, userSchema } from "/schemas/user.ts";

const logger = new Logger();
export const users = new Hono();

console.log({ AUTH_TOKEN_USERS });

users.use("*", bearerAuth({ token: AUTH_TOKEN_USERS }));

users.post("/", async (ctx) => {
  try {
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

    const emailSended = await transporter.sendMail({
      to: email,
      from: EMAIL_USER,
      subject: "API KEY",
      html: `Tu Key para poder empezar a usar la API es: ${apiKey}`,
    });

    if (emailSended.accepted?.length <= 0) {
      logger.error("The api key could not be sent to the email");
    }

    return ctx.json({ success: true }, 201);
  } catch (error) {
    if (error?.message.includes(DUPLICATE_KEY_CODE)) {
      return ctx.json(
        { success: false, message: "The email entered is registered" },
        400
      );
    }

    return ctx.json({ success: false, message: error?.message }, error?.status);
  }
});

users.post("/remember", async (ctx) => {
  try {
    const body = await ctx.req.json();
    const { email } = body;

    if (!email) {
      throw new HTTPException(400, { message: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      throw new HTTPException(404, { message: "User not found" });
    }

    const { apiKey } = user;

    const emailSended = await transporter.sendMail({
      to: email,
      from: EMAIL_USER,
      subject: "API KEY",
      html: `Tu Key para poder empezar a usar la API es: ${apiKey}`,
    });

    if (emailSended.accepted?.length <= 0) {
      logger.error("The api key could not be sent to the email");
      throw new HTTPException(500, {
        message: "The api key could not be sent to the email",
      });
    }

    return ctx.json({ success: true }, 200);
  } catch (error) {
    return ctx.json({ success: false, message: error?.message }, error?.status);
  }
});
