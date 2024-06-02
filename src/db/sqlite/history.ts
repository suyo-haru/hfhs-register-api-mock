import { History } from "../../../type.ts";
import initSqliteDB from "../sqlite/SqliteDatabase.ts";

const db = initSqliteDB();
const listHistoryQuery = db.prepareQuery<
  [string, string, string, number, number, string],
  History,
  {
    class_name: string;
  }
>(`SELECT * FROM history WHERE paid_class = :class_name`);

const addHistoryQuery = db.prepareQuery<
  [],
  Record<never, never>,
  History
>(`INSERT INTO history (payment_id, timestamp, paid_class, total, change, product) VALUES (:payment_id, :timestamp, :paid_class, :total, :change, :product)`);

export function addHistory(
  { payment_id, timestamp, paid_class: class_name, total, change, product }:
    & Omit<History, "timestamp">
    & { timestamp: Date },
) {
  addHistoryQuery.execute({
    payment_id,
    timestamp: timestamp.toISOString(),
    paid_class: class_name,
    total,
    change,
    product,
  });
  console.log("Add history: " + payment_id);
}

export function getAllHistories(class_name: string) {
  return listHistoryQuery.allEntries({ class_name });
}
