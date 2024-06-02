import { History, Setting, User } from "../../type.ts";
import KVDatabase from "./kv/KVDatabase.ts";
import { addHistory, getAllHistories } from "./sqlite/history.ts";
import { getSettings, setSettings } from "./sqlite/settings.ts";
import { addUserInfo, getUserInfo } from "./sqlite/users.ts";

export type DatabaseParam = {
  type: "sqlite";
} | {
  type: "KV";
  path?: string
};

export class Database {
  type;
  kv?;
  constructor(param: DatabaseParam) {
    this.type = param.type;
    if(param.type === "KV") {
      this.kv = new KVDatabase(param.path);
    }
  }

  async getUserInfo(email: string) {
    switch (this.type) {
      case "sqlite":
        return getUserInfo(email);
      case "KV":
        return await this.kv?.getUserInfo(email);
    }
  }

  async addUserInfo(param: User) {
    switch (this.type) {
      case "sqlite":
        return addUserInfo(param);
      case "KV":
        await this.kv?.addUserInfo(param)
        return param;
    }
  }

  async getSettings(class_name: string) {
    switch (this.type) {
      case "sqlite":
        return getSettings(class_name);
      case "KV":
        return await this.kv?.getSettings(class_name);
    }
  }

  async setSettings(param: Partial<Setting> & { class_name: string }) {
    switch (this.type) {
      case "sqlite":
        return setSettings(param);
      case "KV":
        await this.kv?.setSettings(param);
    }
  }

  async getAllHistories(class_name: string) {
    switch(this.type) {
      case "sqlite":
        return getAllHistories(class_name);
      case "KV":
        return await this.kv?.getAllHistories(class_name);
    }
  }

  async addHistory(param: Omit<History, "timestamp"> & { timestamp: Date }) {
    switch(this.type) {
      case "sqlite":
        return addHistory(param);
      case "KV":
        await this.kv?.addHistory(param);
    }
  }
}

export default new Database({type: "KV"});