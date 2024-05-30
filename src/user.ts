import { Hono } from "hono";
import type { JwtVariables } from "hono/jwt";
import { getUserInfo } from "./db/users.ts";

const app = new Hono<{ Variables: JwtVariables }>();

app.get("/", (c) => {
  const payload = c.get("jwtPayload");
  return c.json(getUserInfo(payload.email));
});

export default app;