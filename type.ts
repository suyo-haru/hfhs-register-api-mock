import { z } from "zod";
import { HistorySchema, SettingSchema, UserSchema } from "./schema.ts";

export type Setting = z.infer<typeof SettingSchema>;

export type User = z.infer<typeof UserSchema>;

export type History = z.infer<typeof HistorySchema>;
