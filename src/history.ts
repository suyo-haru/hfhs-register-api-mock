import { Hono } from "hono";
import type { JwtVariables } from "hono/jwt";
import { addHistory, getAllHistories } from "./db/history.ts";
import { AddHistoryQuerySchema } from "../schema.ts";
import { classNameParamValidator, zValidator } from "../util.ts";

const app = new Hono<{ Variables: JwtVariables }>();

app.get(
  "/:class_name",
  classNameParamValidator(),
  (c) => {
    const className = decodeURIComponent(c.req.valid("param").class_name);
    return c.json(getAllHistories(className));
  },
);

app.post(
  "/add/:class_name",
  classNameParamValidator(),
  zValidator("query", AddHistoryQuerySchema),
  async (c) => {
    const className = decodeURIComponent(c.req.valid("param").class_name);
    const { timestamp, total, change, product } = await c.req.valid("query");
    const date = timestamp ? new Date(timestamp[0]) : new Date();
    addHistory(
      crypto.randomUUID(),
      date,
      className,
      total,
      change,
      product,
    );
    return c.json({
      payment_id: crypto.randomUUID(),
      timestamp: date.toISOString(),
      class_name: className,
      total: total,
      change: change,
      product: product,
    });
  },
);

export default app;
