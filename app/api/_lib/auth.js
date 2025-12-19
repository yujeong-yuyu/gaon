import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const COOKIE_NAME = "gaonsid";
const isProd = process.env.NODE_ENV === "production";
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me"; // 배포에서 꼭 설정!

/** JWT 만들기 */
export function signSession(payload, expiresIn = process.env.JWT_EXPIRES || "7d") {
    console.log("세션 생성:", { payload, expiresIn });
    return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

/** (선택) 토큰만 읽기 */
export async function getSessionTokenFromCookies() {
    const store = await cookies();
    const token = store.get(COOKIE_NAME)?.value ?? null;
    console.log("세션 토큰:", token);
    return token;
}

/** 토큰 검증 */
export async function verifySession(token) {
    try {
        const decodedPayload = jwt.verify(token, JWT_SECRET);
        console.log("토큰 검증 성공:", decodedPayload);
        return decodedPayload;
    } catch (error) {
        console.error("JWT 검증 실패:", error.message);
        return null;
    }
}

/** 세션(디코드된 payload) 읽기 */
export async function getSession() {
    const token = await getSessionTokenFromCookies();
    if (!token) return null;
    return verifySession(token);
}

/** 쿠키에 세션 쓰기 */
export async function setSessionCookie(token, opts = {}) {
    const store = await cookies();
    const cookieOptions = {
        httpOnly: true,
        sameSite: "lax",
        secure: false,
        path: "/",
        ...(opts.maxAge ? { maxAge: opts.maxAge } : {}),
    };
    store.set(COOKIE_NAME, token, cookieOptions);
    console.log("쿠키 설정 완료:", cookieOptions);
}

/** 세션 지우기(로그아웃) */
export async function clearSessionCookie() {
    const store = await cookies();
    store.delete(COOKIE_NAME, {
        httpOnly: true,
        sameSite: "lax",
        secure: false,
        path: "/",
    });
    console.log("쿠키 삭제 완료:", COOKIE_NAME);
}

/** 보호 라우트에서 사용 */
export async function requireUser() {
    const s = await getSession();
    if (!s) throw new Error("UNAUTHORIZED");
    return s;
}

/** (옵션) 권한 체크 */
export async function requireRole(role = "admin") {
    const s = await requireUser();
    if (s.role !== role) {
        throw new Error(`FORBIDDEN: Required role is ${role}, but user role is ${s.role}`);
    }
    return s;
}
