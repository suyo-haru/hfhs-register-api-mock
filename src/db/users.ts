import { User } from "../../type.ts";
import SqliteDatabase from "./SqliteDatabase.ts";

const db = SqliteDatabase();
const query = db.prepareQuery<
  [string, string, string, string],
  User,
  {
    email: string
  }
>(`SELECT * FROM users WHERE user_mail = :email`);

export function getUserInfo(email: string) {
  const q = query.firstEntry({ email });
  console.log(q)
  return q;
}