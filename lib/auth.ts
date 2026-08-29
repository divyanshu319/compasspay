import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
const COOKIE = "compass_session";
function signingSecret() { const value = process.env.JWT_SECRET; if (!value || value.length < 32) throw new Error("JWT_SECRET must be set to at least 32 characters."); return new TextEncoder().encode(value); }
export function assertSessionConfiguration() { signingSecret(); }
export async function createSession(user: { id: string; email: string; name: string }) { return new SignJWT({ email: user.email, name: user.name }).setProtectedHeader({ alg: "HS256" }).setSubject(user.id).setIssuedAt().setExpirationTime("7d").sign(signingSecret()); }
export async function currentUser() { const token = (await cookies()).get(COOKIE)?.value; if (!token) return null; try { const { payload } = await jwtVerify(token, signingSecret()); return payload.sub && typeof payload.email === "string" && typeof payload.name === "string" ? { id: payload.sub, email: payload.email, name: payload.name } : null; } catch { return null; } }
export const sessionCookie = (token: string) => ({ name: COOKIE, value: token, httpOnly: true, sameSite: "lax" as const, secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 24 * 7 });
