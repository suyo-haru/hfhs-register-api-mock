import { HTTPException } from "hono/http-exception";
import { jwtDecrypt } from "jose";
import { validator } from "hono/validator";
import type { Context, ValidationTargets } from "hono";
import type { Input } from "hono/types";
import type { JwtVariables } from "hono/jwt";
import type {
  objectInputType,
  objectOutputType,
  UnknownKeysParam,
  ZodObject,
  ZodRawShape,
  ZodTypeAny,
} from "zod";
import { ClassNameParamSchema } from "./schema.ts";

async function hkdf(
  digest = "SHA-256",
  ikm: BufferSource,
  salt: BufferSource,
  info: BufferSource,
  keylen: number,
) {
  return new Uint8Array(
    await crypto.subtle.deriveBits(
      {
        name: "HKDF",
        hash: digest,
        salt,
        info,
      },
      await crypto.subtle.importKey("raw", ikm, "HKDF", false, ["deriveBits"]),
      keylen << 3,
    ),
  );
}

async function getDerivedEncryptionKey(
  keyMaterial: string = "secret",
  salt: string = "",
) {
  const encode = (string: string) => {
    const encoder = new TextEncoder();
    return encoder.encode(string);
  };
  return await hkdf(
    "SHA-256",
    encode(keyMaterial),
    encode(salt),
    encode(`NextAuth.js Generated Encryption Key${salt ? ` (${salt})` : ""}`),
    32,
  );
}

export async function getAutenticate(
  c: Context<{ Variables: JwtVariables }, string, Input>,
) {
  const authHeader = c.req.header("Authorization");
  if (authHeader) {
    const jwt = authHeader.replace("Bearer ", "");
    try {
      const { payload } = await jwtDecrypt(
        jwt,
        await getDerivedEncryptionKey(Deno.env.get("JWT_SECRET")),
        {
          clockTolerance: 15,
        },
      );
      if ("email" in payload) {
        return payload;
      } else {
        throw new HTTPException(403, { message: "Unauthorized" });
      }
    } catch (e) {
      throw e;
    }
  } else {
    c.status(401);
    c.header("WWW-Authnticate", "Bearer");
    throw new HTTPException(401, {
      res: c.json({ status: 401, description: "Authorization Required" }),
    });
  }
}

type ValidationTargetKeysWithBody = "form" | "json";
type ValidationTargetByMethod<M> = M extends "get" | "head" // GET and HEAD request must not have a body content.
  ? Exclude<keyof ValidationTargets, ValidationTargetKeysWithBody>
  : keyof ValidationTargets;

export function zValidator<
  M extends string,
  T extends ZodRawShape,
  UnknownKeys extends UnknownKeysParam = UnknownKeysParam,
  Catchall extends ZodTypeAny = ZodTypeAny,
  Output = objectOutputType<T, Catchall, UnknownKeys>,
  Input = objectInputType<T, Catchall, UnknownKeys>,
>(
  target: ValidationTargetByMethod<M>,
  schema: ZodObject<T, UnknownKeys, Catchall, Output, Input>,
) {
  return validator(target, (value, _c) => {
    const param = schema.safeParse(value);
    if (!param.success) {
      throw new HTTPException(400);
    }
    return param.data;
  });
}

export function classNameParamValidator() {
  return validator("param", (value) => {
    const param = ClassNameParamSchema.safeParse(value);
    if (!param.success) {
      throw new HTTPException(400);
    }
    return param.data;
  });
}
