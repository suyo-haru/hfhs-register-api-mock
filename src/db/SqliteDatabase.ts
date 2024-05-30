import { DB } from "sqlite3";

let db: DB;

export default function SqliteDatabase(path: string = "hfhs-regi.sqlite3") {
  if (!db) {
    db = new DB(path);
    db.execute(
`CREATE TABLE IF NOT EXISTS history (
  payment_id TEXT NOT NULL,
  paid_class TEXT NOT NULL,
  timestamp TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  total INTEGER NOT NULL,
  change INTEGER NOT NULL,
  product TEXT NOT NULL,
  PRIMARY KEY (payment_id)
);
CREATE TABLE IF NOT EXISTS setting (
  class_name TEXT NOT NULL,
  goal INTEGER NOT NULL,
  reserve INTEGER NOT NULL,
  additionalreserve INTEGER NOT NULL,
  PRIMARY KEY (class_name)
);
CREATE TABLE IF NOT EXISTS users (
  user_mail TEXT NOT NULL,
  user_name TEXT NOT NULL DEFAULT '',
  user_class TEXT NOT NULL DEFAULT '',
  user_role TEXT NOT NULL DEFAULT 'student',
  PRIMARY KEY (user_mail)
);
`,
    );
  }
  return db;
}
