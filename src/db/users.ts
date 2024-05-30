import SqliteDatabase from "./SqliteDatabase.ts";

const db = SqliteDatabase();
const query = db.prepareQuery<
  [string, string, string, string],
  {
    user_mail: string;
    user_name: string;
    user_class: string;
    user_role: string;
  }
>(`SELECT * FROM users WHERE user_mail = :email`);

export function getUserInfo(email: string) {
  const q = query.firstEntry({ email });
  console.log(q)
  return q;
}