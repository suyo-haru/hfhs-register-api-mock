import { History, Setting, User } from "../../../type.ts";

export default class KVDatabase {
  kv?: Deno.Kv;
  constructor(path?: string) {
    Deno.openKv(path).then((kv) => {
      this.kv = kv;
    });
  }

  async getUserInfo(email: string) {
    return (await this.kv?.get<User>(["users", email]))?.value ?? undefined;
  }

  async addUserInfo(param: User) {
    return (await this.kv?.set(["users", param.user_mail], param))?.ok;
  }

  async getAllHistories(class_name: string) {
    const entries = await this.kv?.list<History>({
      prefix: ["history", class_name],
    });
    if (entries) {
      const list = [];
      for await (const entry of entries) {
        list.push(entry.value);
      }
      return list;
    } else {
      return [];
    }
  }

  async addHistory(param: Omit<History, "timestamp"> & { timestamp: Date }) {
    return (await this.kv?.set(
      ["history", param.paid_class, param.payment_id],
      { ...param, timestamp: param.timestamp.toISOString()},
    ))?.ok;
  }

  async getSettings(class_name: string) {
    return (await this.kv?.get<Setting>(["settings", class_name]))?.value ??
      undefined;
  }

  async setSettings(
    param: Partial<Setting> & {
      class_name: string;
    },
  ) {
    return (await this.kv?.set(["settings", param.class_name], param))?.ok;
  };
}
