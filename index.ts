import { compress } from "https://deno.land/x/hono@v3.7.2/middleware/compress/index.ts";
import { cors } from "https://deno.land/x/hono@v3.7.2/middleware/cors/index.ts";
import { logger as logs } from "https://deno.land/x/hono@v3.7.2/middleware/logger/index.ts";
import { Hono } from "https://deno.land/x/hono@v3.7.2/mod.ts";
import Logger from "https://deno.land/x/logger@v1.1.1/logger.ts";
import * as mongoose from "npm:mongoose@7.6.3";
import { MONGODB_URI, PORT } from "./config/app-constants.ts";
import { questions } from "./routes/questions.ts";

const app = new Hono();
const logger = new Logger();

app.use("*", logs());
app.use("*", cors());
app.use("*", compress());
app.route("/questions", questions);

const onListen = (): void => {
  logger.info(`Listening on port ${PORT}...`);
  mongoose
    .connect(MONGODB_URI)
    .then((): void => logger.info("Connected!"))
    .catch((error): void =>
      logger.error(error?.message || JSON.stringify(error))
    );
};

Deno.serve(
  {
    port: parseInt(PORT),
    onListen,
  },
  app.fetch
);
