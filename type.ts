import { QueryParameter } from "sqlite3"

export interface History extends Record<string, QueryParameter> {
  payment_id: string;
  paid_class: string;
  timestamp: string;
  total: number;
  change: number;
  product: string;
}

export interface Setting extends Record<string, QueryParameter> {
  class_name: string;
  goal: number;
  reserve: number;
  additionalreserve: number;
}

export interface HistoryAdd extends Record<string, QueryParameter> {
  class_name: string;
  total: number;
  number: number;
  product: number;
}

export interface User extends Record<string, QueryParameter> {
  user_mail: string;
  user_name: string;
  user_class: string;
  user_role: "Admin" | "" | undefined;
}
