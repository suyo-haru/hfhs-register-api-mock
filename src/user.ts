import { Hono } from "hono";
import type { JwtVariables } from "hono/jwt";
import { addUserInfo, getUserInfo } from "./db/users.ts";
import { UserSchema } from "../schema.ts";
import { zValidator } from "../util.ts";

const app = new Hono<{ Variables: JwtVariables }>();

app.get("/", (c) => {
  const payload = c.get("jwtPayload");
  return c.json(getUserInfo(payload.email));
});

app.post("/add",
  zValidator("json", UserSchema),
  (c) => {
    return c.json(addUserInfo(c.req.valid("json")));
  }
);

export default app;