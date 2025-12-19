"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

import Header2 from "@/components/Header2";
import Footer2 from "@/components/Footer2";

import styles from "./Members.module.css";
import responsive from "./response-Members.module.css";

export default function Members({ openMenu }) {
    const searchParams = useSearchParams();
    const isTeacher = searchParams.get("role") === "teacher";

    const [allChecked, setAllChecked] = useState(false);
    const [checks, setChecks] = useState({
        check1: false,
        check2: false,
        check3: false,
    });

    const [formData, setFormData] = useState({
        id: "",
        password: "",
        passwordCheck: "",
        email: "",
    });

    const allcheck = () => {
        const newState = !allChecked;
        setAllChecked(newState);
        setChecks({ check1: newState, check2: newState, check3: newState });
    };

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        const updated = { ...checks, [name]: checked };
        setChecks(updated);
        setAllChecked(Object.values(updated).every(Boolean));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleIdCheck = async () => {
        if (!formData.id) {
            alert("아이디를 입력해주세요.");
            return;
        }
        try {
            const res = await fetch(`/api/check_id?uid=${encodeURIComponent(formData.id)}`, { cache: "no-store" });
            const data = await res.json();

            if (!res.ok || !data.ok) {
                throw new Error(data.error || "아이디 확인 실패");
            }
            alert(data.message); // "사용 가능" 또는 "이미 사용 중"
        } catch (err) {
            alert("아이디 중복 확인에 실패했습니다: " + err.message);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.passwordCheck) {
            alert("비밀번호가 일치하지 않습니다.");
            return;
        }

        try {
            const res = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: formData.id,
                    password: formData.password,
                    email: formData.email,   // ← 서버도 저장하게 수정 완료
                    name: formData.id,       // ← 원하면 닉네임/이름으로 같이 저장
                }),
            });

            const contentType = res.headers.get("content-type") || "";
            let data;
            if (contentType.includes("application/json")) {
                data = await res.json();
            } else {
                const text = await res.text();
                data = { ok: false, error: text || "NON_JSON_RESPONSE" };
            }

            if (!res.ok || !data?.ok) {
                throw new Error(data?.error || "회원가입 실패");
            }

            alert("회원가입 성공!");
            setFormData({ id: "", password: "", passwordCheck: "", email: "" });
            setChecks({ check1: false, check2: false, check3: false });
            setAllChecked(false);

            window.location.href = "/login";
        } catch (err) {
            alert(`회원가입에 실패했습니다: ${err.message}`);
        }
    };


    return (
        <>
            <Header2 openMenu={openMenu} />
            <div
                className={`${styles.wrapMB} ${responsive.wrapMB} ${isTeacher ? "teacher-mode" : ""
                    }`}
            >
                <div className={`${styles.containerMB} ${responsive.containerMB}`}>
                    <span className={`${styles.titleMB} ${responsive.titleMB}`}>
                        회원가입
                    </span>
                    <form onSubmit={handleSubmit}>
                        {/* 아이디 */}
                        <p className={`${styles.idpMB} ${responsive.idpMB}`}>
                            아이디<span className={styles.starMB}>*</span>
                        </p>
                        <div className={`${styles.idboxMB} ${responsive.idboxMB}`}>
                            <input
                                type="text"
                                name="id"
                                value={formData.id}
                                onChange={handleChange}
                                placeholder="아이디 입력"
                                required
                            />
                            <button
                                className={`${styles.idcheckMB} ${responsive.idcheckMB}`}
                                type="button"
                                onClick={handleIdCheck} // 중복확인 버튼 클릭 시 ID 체크
                            >
                                중복확인
                            </button>
                        </div>

                        {/* 비밀번호 */}
                        <p className={`${styles.pwpMB} ${responsive.pwpMB}`}>
                            비밀번호<span className={styles.starMB}>*</span>
                        </p>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="비밀번호"
                            required
                        />
                        <input
                            type="password"
                            name="passwordCheck"
                            value={formData.passwordCheck}
                            onChange={handleChange}
                            placeholder="비밀번호 확인"
                            required
                        />

                        {/* 이메일 */}
                        <p className={`${styles.empMB} ${responsive.empMB}`}>
                            이메일<span className={styles.starMB}>*</span>
                        </p>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="이메일"
                            required
                        />

                        {/* 체크박스 */}
                        <p className={`${styles.agreepMB} ${responsive.agreepMB}`}>
                            이용약관동의
                        </p>
                        <div
                            className={`${styles.allMB} ${responsive.allMB} ${allChecked ? styles.active : ""}`}
                            onClick={allcheck}
                        >
                            전체동의{" "}
                            <span
                                className={`${styles.allspanMB} ${allChecked ? styles.active : ""}`}
                            >
                                (필수, 선택 포함)
                            </span>
                            <img src="https://kjwon2025.github.io/gaonimg/img/memberallcheck.png" alt="check" />
                        </div>

                        <div className={`${styles.checkboxMB} ${responsive.checkboxMB}`}>
                            <div>
                                <input
                                    type="checkbox"
                                    name="check1"
                                    id="check1MB"
                                    checked={checks.check1}
                                    onChange={handleCheckboxChange}
                                    required
                                />
                                <label htmlFor="check1MB">
                                    서비스 이용약관 및 개인정보 수집·이용에 동의합니다.{" "}
                                    <span className={styles.starMB}>*</span>
                                </label>
                            </div>
                            <div>
                                <input
                                    type="checkbox"
                                    name="check2"
                                    id="check2MB"
                                    checked={checks.check2}
                                    onChange={handleCheckboxChange}
                                    required
                                />
                                <label htmlFor="check2MB">
                                    회원가입을 위해 개인정보 수집·이용 및 제공에 동의합니다.{" "}
                                    <span className={styles.starMB}>*</span>
                                </label>
                            </div>
                            <div>
                                <input
                                    type="checkbox"
                                    name="check3"
                                    id="check3MB"
                                    checked={checks.check3}
                                    onChange={handleCheckboxChange}
                                />
                                <label htmlFor="check3MB">
                                    이벤트, 할인, 맞춤형 정보 제공을 위한 이메일/문자 수신에 동의합니다.
                                </label>
                            </div>
                        </div>

                        <span className={`${styles.alertspanMB} ${responsive.alertspanMB}`}>
                            입력한 개인정보는 서비스 제공 및 회원관리 목적 외에는 사용되지 않습니다.
                            <br />
                            필수 약관에 동의하지 않으면 회원가입이 불가합니다.
                            <br />
                            선택 약관은 동의하지 않아도 서비스 이용에는 제한이 없습니다.
                        </span>
                        <button className={`${styles.submitMB} ${responsive.submitMB}`} type="submit">SIGN IN</button>
                    </form>
                </div>
            </div>
            <Footer2 />
        </>
    );
}
