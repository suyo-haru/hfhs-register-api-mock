import { Hono } from "hono";
import type { JwtVariables } from "hono/jwt";

const app = new Hono<{ Variables: JwtVariables }>();

app.get("/", (c) => {
  const payload = c.get("jwtPayload");
  return c.json({ isLogin: payload.email as string });
});

export default app;
