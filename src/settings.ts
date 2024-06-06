import { Hono } from "hono";
import type { JwtVariables } from "hono/jwt";
import db from "./db/Database.ts";
import { SetSettingQuerySchema } from "../schema.ts";
import { classNameParamValidator, zValidator } from "../util.ts";
import { HTTPException } from "jsr:@hono/hono@^4.4.0/http-exception";

const app = new Hono<{ Variables: JwtVariables }>();

app.get(
  "/:class_name",
  classNameParamValidator(),
  async (c) => {
    const className = decodeURIComponent(c.req.param("class_name"));
    const settings = await db.getSettings(className);
    if(!settings) throw new HTTPException(404, {message: `"${className}" is not found.`})
    return c.json(settings);
  },
);

app.post(
  "/set/:class_name",
  classNameParamValidator(),
  zValidator("query", SetSettingQuerySchema),
  async (c) => {
    const className = decodeURIComponent(c.req.valid("param").class_name);
    const { goal, reserve, additionalreserve } = c.req.valid("query");
    const settings = {
      class_name: className,
      goal,
      reserve,
      additionalreserve,
    };
    await db.setSettings(settings);
    return c.json(settings);
  },
);

export default app;
