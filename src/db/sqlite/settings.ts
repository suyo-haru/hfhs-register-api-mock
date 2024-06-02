import { Setting } from "../../../type.ts";
import initSqliteDB from "./SqliteDatabase.ts";

const db = initSqliteDB();

const getSettingsQuery = db.prepareQuery<
  [string, number, number, number],
  Setting,
  { class_name: string }
>(`SELECT * FROM setting WHERE class_name = :class_name`);

const setSettingsQuery = db.prepareQuery<
  [],
  Record<never, never>,
  Setting
>(`INSERT INTO setting (class_name, goal, reserve, additionalreserve) VALUES (:class_name, :goal, :reserve, :additionalreserve)
  ON CONFLICT(class_name) DO UPDATE SET (goal, reserve, additionalreserve) = (:goal, :reserve, :additionalreserve)`);

export function getSettings(class_name: string) {
  const q = getSettingsQuery.firstEntry({ class_name });
  console.log(q);
  return q;
}

export function setSettings(
  { class_name, goal, reserve, additionalreserve }: Partial<Setting> & {
    class_name: string;
  },
) {
  setSettingsQuery.execute({
    class_name,
    goal: goal ?? 0,
    reserve: reserve ?? 0,
    additionalreserve: additionalreserve ?? 0,
  });
  console.log("Set settings: " + class_name);
}
