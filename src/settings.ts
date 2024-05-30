import { Hono } from "hono";
import type { JwtVariables } from "hono/jwt";
import { getSettings, setSettings } from "./db/settings.ts";

const app = new Hono<{ Variables: JwtVariables }>();

app.get("/:class_name", (c) => {
  const className = decodeURIComponent(c.req.param("class_name"));
  return c.json(getSettings(className));
});

app.post("/set/:class_name", async (c) => {
  const className = decodeURIComponent(c.req.param("class_name"));
  const { goal, reserve, additionalreserve } = await c.req.queries();

  setSettings(
    className,
    parseInt(goal[0]),
    parseInt(reserve[0]),
    parseInt(additionalreserve[0])
  )
  return c.json({
    class_name: className,
    goal: goal[0],
    reserve: reserve[0],
    additionalreserve: additionalreserve[0]
  })
});

export default app;
