import { Hono } from "hono";
import type { JwtVariables } from "hono/jwt";
import db from "./db/Database.ts";
import { UserSchema } from "../schema.ts";
import { zValidator } from "../util.ts";

const app = new Hono<{ Variables: JwtVariables }>();

app.get("/", async (c) => {
  const payload = c.get("jwtPayload");
  return c.json(await db.getUserInfo(payload.email));
});

app.post("/add",
  zValidator("json", UserSchema),
  async (c) => {
    return c.json(await db.addUserInfo(c.req.valid("json")));
  }
);

export default app;