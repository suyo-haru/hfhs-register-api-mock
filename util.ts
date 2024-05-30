import { Context, Env } from "hono";
import { HTTPException } from "hono/http-exception";
import { jwtDecrypt } from "jose";
import { Input } from "hono/types";
import { JwtVariables } from "jsr:@hono/hono@^4.4.0/jwt";

async function hkdf(digest = "SHA-256", ikm: BufferSource, salt: BufferSource, info: BufferSource, keylen: number) {
    return new Uint8Array(await crypto.subtle.deriveBits({
        name: 'HKDF',
        hash: digest,
        salt,
        info,
    }, await crypto.subtle.importKey('raw', ikm, 'HKDF', false, ['deriveBits']), keylen << 3));
};

async function getDerivedEncryptionKey(
  keyMaterial: string = "secret",
  salt: string = "",
) {
  const encode = (string: string) => {const encoder = new TextEncoder();return encoder.encode(string)};
  return await hkdf(
    "SHA-256",
    encode(keyMaterial),
    encode(salt),
    encode(`NextAuth.js Generated Encryption Key${salt ? ` (${salt})` : ""}`),
    32
  )
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
        await getDerivedEncryptionKey(),
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
