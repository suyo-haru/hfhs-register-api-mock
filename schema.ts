import { z } from "zod";

const fromStringToNumber = (val: string, ctx: z.RefinementCtx) => {
  const parsed = parseInt(val)
  if(isNaN(parsed)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Not a number"
    })
    return z.NEVER
  }
  return parsed;
}

export const UserSchema = z.object({
  user_mail: z.string().email(),
  user_name: z.string(),
  user_class: z.string(),
  user_role: z.enum(["Admin", ""]).optional(),
});

export const SetSettingQuerySchema = z.object({
  goal: z.string().transform(fromStringToNumber),
  reserve: z.string().transform(fromStringToNumber),
  additionalreserve: z.string().transform(fromStringToNumber),
});

export const SettingSchema = z.object({
  class_name: z.string(),
  goal: z.number(),
  reserve: z.number(),
  additionalreserve: z.number(),
});

export const HistorySchema = z.object({
  payment_id: z.string(),
  paid_class: z.string(),
  timestamp: z.string().datetime(),
  total: z.number(),
  change: z.number(),
  product: z.string(),
});

export const AddHistoryQuerySchema = z.object({
  timestamp: z.string().datetime().optional(),
  total: z.string().transform(fromStringToNumber),
  change: z.string().transform(fromStringToNumber),
  product: z.string()
})

export const ClassNameParamSchema = z.object({
  class_name: z.string(),
});