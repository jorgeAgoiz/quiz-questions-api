import { load } from "https://deno.land/std@0.204.0/dotenv/mod.ts";
import { Hono } from "https://deno.land/x/hono@v3.7.2/mod.ts";
import { questions } from "./routes/questions.ts";

const env = await load();
const app = new Hono();

app.get("/", (c) => {
  return c.json({ message: "HELLO WORLD!", name: "Jorge", port: env["PORT"] });
});

app.route("/questions", questions);

Deno.serve(
  {
    port: 3012,
    onListen: (): void => console.log("hola ke ase"),
  },
  app.fetch
);
