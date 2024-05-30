interface History {
  payment_id: string;
  paid_class: string;
  timestamp: Date;
  total: number;
  change: number;
  product: number;
}

interface Setting {
  class_name: string;
  goal: number;
  reserve: number;
  additionalreserve: number;
}

interface HistoryAdd {
  class_name: string;
  total: number;
  number: number;
  product: number;
}

interface User {
  user_mail: string;
  user_name: string;
  user_class: string;
  user_role: "Admin" | "" | undefined;
}
