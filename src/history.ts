import { Hono } from "hono";
import type { JwtVariables } from "hono/jwt";
import { addHistory, getAllHistories } from "./db/history.ts";

const app = new Hono<{ Variables: JwtVariables }>();

app.get("/:class_name", (c) => {
  const className = decodeURIComponent(c.req.param("class_name"));
  return c.json(getAllHistories(className));
});

app.post("/add/:class_name", async (c) => {
  const className = decodeURIComponent(c.req.param("class_name"));
  const { timestamp, total, change, product } = await c.req.queries();
  const date = timestamp ? new Date(timestamp[0]) : new Date()
  addHistory(
    crypto.randomUUID(),
    date,
    className,
    parseInt(total[0]),
    parseInt(change[0]),
    product[0],
  );
  return c.json({
    payment_id: crypto.randomUUID(),
    timestamp: date.toISOString(),
    class_name: className,
    total: total[0],
    change: change[0],
    product: product[0],
  });
});

export default app;
