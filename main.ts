import { Hono } from "hono";
import { cors } from "hono/cors";
import type { JwtVariables } from "hono/jwt";
import { getAutenticate } from "./util.ts";
import { auth, history, settings, user } from "./src/index.ts";

const app = new Hono<{ Variables: JwtVariables }>();

app.use(cors({
  origin: [
    "https://regi.hfhs-digital.app",
    "https://hfhs-registar.vercel.app",
    "http://localhost",
    "http://localhost:3000",
  ],
}));

app.use("/*", async (c, next) => {
  const payload = await getAutenticate(c);
  c.set("jwtPayload", payload);
  await next();
});

app.get("/", (c) => {
  c.status(200);
  return c.json({ status: "200 OK" });
});

app.route("/user", user);
app.route("/auth", auth);
app.route("/history", history);
app.route("/setting", settings);

export default app;
