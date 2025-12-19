"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import "../global.css";

import Header2 from "@/components/Header2";
import Footer2 from "@/components/Footer2";

import login from "./Login.module.css";
import responsive from "./response-Login.module.css";

export default function Login({ openMenu }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    id: "",
    password: "",
    remember: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    const savedRemember = typeof window !== "undefined" && localStorage.getItem("remember") === "1";
    if (savedRemember) setFormData((p) => ({ ...p, remember: true }));
  }, []);

  const cls = (base, responsiveClass) => `${base} ${responsiveClass}`;

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    const id = formData.id.trim();
    const password = formData.password.trim();

    if (!id || !password) {
      setErrMsg("아이디와 비밀번호를 입력해주세요.");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrMsg("");

      // ★ 아이디/비번 전송
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, password, remember: formData.remember }),
        credentials: "include",
      });

      const ct = res.headers.get("content-type") || "";
      const data = ct.includes("application/json") ? await res.json() : { ok: false, error: await res.text() };

      if (!res.ok || !data?.ok) throw new Error(data?.error || "로그인 실패");

      // 세션 점검: { ok, user } 형태
      const meRes = await fetch("/api/me", {
        cache: "no-store",
        credentials: "include", // 쿠키 포함
      });
      const meCt = meRes.headers.get("content-type") || "";
      const me = meCt.includes("application/json") ? await meRes.json() : null;
      if (!me?.ok || !me?.user) throw new Error("세션 생성에 실패했습니다.");

      localStorage.setItem("remember", formData.remember ? "1" : "0");
      alert("로그인 성공!");
      router.push("/mypage");
    } catch (err) {
      setErrMsg(err.message || "로그인 실패");
    } finally {
      setIsSubmitting(false);
    }
  };
  const kakaoLogin = useCallback(() => {
    const REST_API_KEY = process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY;
    if (!REST_API_KEY) { setErrMsg("카카오 설정이 올바르지 않습니다.(환경변수 확인)"); return; }

    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const redirectUri = `${origin}/api/auth/kakao/callback`;
    const state = Math.random().toString(36).slice(2);
    try { localStorage.setItem("oauth_state_kakao", state); } catch { }

    // ✨ 이메일 요청을 토글로 제어 (예: .env에서 NEXT_PUBLIC_KAKAO_REQ_EMAIL=1)
    const wantEmail = process.env.NEXT_PUBLIC_KAKAO_REQ_EMAIL === "1";
    const scopes = ["profile_nickname", "profile_image"];
    if (wantEmail) scopes.push("account_email");

    const params = new URLSearchParams({
      client_id: REST_API_KEY,
      redirect_uri: redirectUri,
      response_type: "code",
      scope: scopes.join(" "), // 공백 구분!
      state,
    });

    window.location.href = `https://kauth.kakao.com/oauth/authorize?${params.toString()}`;
  }, []);



  const googleLogin = useCallback(() => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId) {
      setErrMsg("구글 설정이 올바르지 않습니다.(환경변수 확인)");
      return;
    }
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const redirectUri = `${origin}/api/auth/google/callback`;
    const scope = "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email";
    const state = Math.random().toString(36).slice(2);
    try { localStorage.setItem("oauth_state_google", state); } catch { }
    const params = new URLSearchParams({
      response_type: "code",
      client_id: clientId,
      redirect_uri: redirectUri,
      scope,
      access_type: "offline",
      prompt: "consent",
      state,
    });
    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  }, []);

  return (
    <>
      <Header2 openMenu={openMenu} />

      <div className={cls(login.wrapLG, responsive.wrapLG)}>
        <div className={cls(login.containerLG, responsive.containerLG)}>

          {/* 왼쪽: 회원가입/소셜 */}
          <div className={cls(login.leftboxLG, responsive.leftboxLG)}>
            <span className={cls(login.title1LG, responsive.title1LG)}>회원가입</span>

            <div className={cls(login.choiceLG, responsive.choiceLG)}>
              <Link href="/members" className={cls(login.normalLG, responsive.normalLG)}>
                <img src="https://raw.githubusercontent.com/kjwon2025/gaonimg/main/img/normalpeople.png" alt="일반 회원 가입" />{" "}
                일반인
              </Link>

              <Link
                href={{ pathname: "/members", query: { role: "teacher" } }}
                className={cls(login.teacherLG, responsive.teacherLG)}
              >
                <img src="https://raw.githubusercontent.com/kjwon2025/gaonimg/main/img/teacher.png" alt="강사 회원 가입" />{" "}
                강사
              </Link>
            </div>

            <div className={cls(login.title2LG, responsive.title2LG)}>
              <div className={cls(login.lineLG, responsive.lineLG)} />
              <span>소셜 로그인</span>
              <div className={cls(login.lineLG, responsive.lineLG)} />
            </div>

            <div className={cls(login.snsboxLG, responsive.snsboxLG)}>
              <button type="button" aria-label="카카오 로그인" onClick={kakaoLogin} style={{ background: "none", border: 0, padding: 0, cursor: "pointer" }}>
                <img src="https://raw.githubusercontent.com/kjwon2025/gaonimg/main/img/kakao.png" alt="" width="50" height="50" />
              </button>

              <button type="button" aria-label="네이버 로그인" style={{ background: "none", border: 0, padding: 0, cursor: "not-allowed", opacity: 0.6 }} disabled>
                <img src="https://raw.githubusercontent.com/kjwon2025/gaonimg/main/img/naver.png" alt="" width="50" height="50" />
              </button>

              <button type="button" aria-label="구글 로그인" onClick={googleLogin} style={{ background: "none", border: 0, padding: 0, cursor: "pointer" }}>
                <img src="https://raw.githubusercontent.com/kjwon2025/gaonimg/main/img/google.png" alt="" width="50" height="50" />
              </button>
            </div>
          </div>

          {/* 오른쪽: 로그인 폼 (ID 전용) */}
          <div className={cls(login.rightboxLG, responsive.rightboxLG)}>
            <span className={cls(login.title3LG, responsive.title3LG)}>로그인</span>

            {errMsg && (
              <div role="alert" style={{ color: "#d00", margin: "0 0 8px 0", fontSize: 14 }}>
                {errMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} autoComplete="on">
              {/* 자동완성 트랩(크롬 비번관리 팝업 줄이기) */}
              <input type="text" name="username" autoComplete="username" tabIndex={-1} style={{ position: "absolute", left: "-9999px", height: 0, opacity: 0 }} aria-hidden="true" />
              <input type="password" name="password" autoComplete="current-password" tabIndex={-1} style={{ position: "absolute", left: "-9999px", height: 0, opacity: 0 }} aria-hidden="true" />

              <input
                type="text"
                name="id"
                value={formData.id}
                onChange={handleChange}
                placeholder="아이디 입력"
                autoComplete="username"      // ★ ID 로그인 힌트
                autoCapitalize="off"
                autoCorrect="off"
                spellCheck={false}
                required
              />

              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="비밀번호 입력"
                autoComplete="current-password"
                required
              />

              <div className={cls(login.optionboxLG, responsive.optionboxLG)}>
                <input type="checkbox" name="remember" id="auto" checked={formData.remember} onChange={handleChange} />
                <label htmlFor="auto">자동로그인</label>
                <Link href="/account/recovery" aria-label="아이디/비밀번호 찾기">아이디/비밀번호 찾기</Link>
              </div>

              <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "SIGNING IN..." : "SIGN IN"}
              </button>
            </form>
          </div>
        </div>
      </div>

      <Footer2 />
    </>
  );
}
