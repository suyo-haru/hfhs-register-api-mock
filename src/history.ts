import { Hono } from "hono";
import type { JwtVariables } from "hono/jwt";
import db from "./db/Database.ts";
import { AddHistoryQuerySchema } from "../schema.ts";
import { classNameParamValidator, zValidator } from "../util.ts";

const app = new Hono<{ Variables: JwtVariables }>();

app.get(
  "/:class_name",
  classNameParamValidator(),
  async (c) => {
    const className = decodeURIComponent(c.req.valid("param").class_name);
    return c.json(await db.getAllHistories(className) ?? []);
  },
);

app.post(
  "/add/:class_name",
  classNameParamValidator(),
  zValidator("query", AddHistoryQuerySchema),
  async (c) => {
    const className = decodeURIComponent(c.req.valid("param").class_name);
    const { timestamp, total, change, product } = c.req.valid("query");
    const date = timestamp ? new Date(timestamp[0]) : new Date();
    const history = {
      payment_id: crypto.randomUUID(),
      timestamp: date,
      paid_class: className,
      total,
      change,
      product,
    }
    await db.addHistory(history);
    return c.json(history);
  },
);

export default app;
