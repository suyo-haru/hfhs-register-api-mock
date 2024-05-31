import { Hono } from "hono";
import type { JwtVariables } from "hono/jwt";
import { getSettings, setSettings } from "./db/settings.ts";
import { SetSettingQuerySchema } from "../schema.ts";
import { classNameParamValidator, zValidator } from "../util.ts";

const app = new Hono<{ Variables: JwtVariables }>();

app.get(
  "/:class_name",
  classNameParamValidator(),
  (c) => {
    const className = decodeURIComponent(c.req.param("class_name"));
    return c.json(getSettings(className));
  },
);

app.post(
  "/set/:class_name",
  classNameParamValidator(),
  zValidator("query", SetSettingQuerySchema),
  async (c) => {
    const className = decodeURIComponent(c.req.valid("param").class_name);
    const { goal, reserve, additionalreserve } = await c.req.valid("query");

    setSettings(
      className,
      goal,
      reserve,
      additionalreserve,
    );
    return c.json({
      class_name: className,
      goal: goal,
      reserve: reserve,
      additionalreserve: additionalreserve,
    });
  },
);

export default app;
