import crypto from "crypto";

/** Hash a password using scrypt: returns "salt:hash" */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

/** Verify a password against a "salt:hash" stored value */
export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  try {
    const candidate = crypto.scryptSync(password, salt, 64);
    const hashBuf = Buffer.from(hash, "hex");
    if (hashBuf.length !== candidate.length) return false;
    return crypto.timingSafeEqual(candidate, hashBuf);
  } catch {
    return false;
  }
}
