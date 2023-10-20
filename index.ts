import { MONGODB_URI, PORT } from "./config/app-constants.ts";
import { Hono, Logger, compress, cors, logs, mongoose } from "./deps.ts";
import { users } from "./routes/auth.ts";
import { questions } from "./routes/questions.ts";

const app = new Hono();
const logger = new Logger();

app.use("*", logs());
app.use("*", cors());
app.use("*", compress());
app.route("/questions", questions);
app.route("/auth", users);

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
