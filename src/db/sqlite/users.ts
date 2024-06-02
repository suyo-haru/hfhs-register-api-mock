import { User } from "../../../type.ts";
import initSqliteDB from "./SqliteDatabase.ts";

const db = initSqliteDB();
const query = db.prepareQuery<
  [string, string, string, string],
  User,
  {
    email: string
  }
>(`SELECT * FROM users WHERE user_mail = :email`);


const addUserQuery = db.prepareQuery<
  [],
  Record<never, never>,
  User
>(`INSERT INTO users (user_mail, user_name, user_class, user_role) VALUES (:user_mail, :user_name, :user_class, :user_role)`);

export function getUserInfo(email: string) {
  const q = query.firstEntry({ email });
  console.log(q)
  return q;
}

export function addUserInfo(param: User) {
  addUserQuery.execute(param);
  return param;
}