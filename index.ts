import { compress } from "https://deno.land/x/hono@v3.7.2/middleware/compress/index.ts";
import { cors } from "https://deno.land/x/hono@v3.7.2/middleware/cors/index.ts";
import { logger } from "https://deno.land/x/hono@v3.7.2/middleware/logger/index.ts";
import { Hono } from "https://deno.land/x/hono@v3.7.2/mod.ts";
import { PORT } from "./config/app-constants.ts";
import { questions } from "./routes/questions.ts";

const app = new Hono();

app.use("*", logger());
app.use("*", cors());
app.use("*", compress());
app.route("/questions", questions);

Deno.serve(
  {
    port: parseInt(PORT),
    onListen: (): void => console.log(`Listening on port ${PORT}...`),
  },
  app.fetch
);
