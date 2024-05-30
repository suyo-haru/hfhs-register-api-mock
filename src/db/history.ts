import { History } from "../../type.ts";
import SqliteDatabase from "./SqliteDatabase.ts";

const db = SqliteDatabase();
const listHistoryQuery = db.prepareQuery<
  [string, string, string, number, number, string],
  {
    payment_id: string;
    paid_class: string;
    timestamp: string;
    total: number;
    change: number;
    product: string;
  }, {
    class_name: string
  }
>(`SELECT * FROM history WHERE paid_class = :class_name`);

const addHistoryQuery = db.prepareQuery<
  [],
  Record<never, never>,
  History
>(`INSERT INTO history (payment_id, timestamp, paid_class, total, change, product) VALUES (:payment_id, :timestamp, :paid_class, :total, :change, :product)`);

export function addHistory(
  payment_id: string,
  timestamp: Date,
  class_name: string,
  total: number,
  change: number,
  product: string,
) {
  addHistoryQuery.execute({
    payment_id,
    timestamp: timestamp.toISOString(),
    paid_class: class_name,
    total,
    change,
    product,
  });
  console.log("Add history: " + payment_id)
}

export function getAllHistories(class_name: string) {
  return listHistoryQuery.allEntries({class_name})
}