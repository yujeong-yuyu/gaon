"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams  } from "next/navigation";
import Header2 from "@/components/Header2";
import Footer2 from "@/components/Footer2";
import styles from "@/styles/p-css/Community_post.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faTrash, faPen } from "@fortawesome/free-solid-svg-icons";

export default function CommunityPostClient({ id }) {

    const router = useRouter();
    const searchParams = useSearchParams(); // ✅ 추가

    const [postData, setPostData] = useState({
        title: "",
        content: "",
        images: [],
        userId: "",
        category: "",
        authorId: null,
        authorName: ""
    });
    const [loading, setLoading] = useState(true); // 로딩 상태 추가
    const [loginUserId, setLoginUserId] = useState(null); // 로그인 사용자 정보
    const [displayName, setDisplayName] = useState(null); // 로그인한 사용자 표시 이름

    const mainImageRef = useRef(null);
    const contentRowRef = useRef(null);
    const [mainImageWidth, setMainImageWidth] = useState(0);
    const [contentHeight, setContentHeight] = useState(0);

    

    // 로그인 사용자 정보 가져오기
    useEffect(() => {
        const fetchLoginUser = async () => {
            try {
                const res = await fetch("/api/session", { cache: "no-store" });
                if (!res.ok) throw new Error("세션 조회 실패");
                const data = await res.json();
                setLoginUserId(data.user?.uid ?? null);
                setDisplayName(data.user?.displayName || data.user?.nickname || data.user?.name || "사용자");
            } catch (err) {
                console.error(err);
                setLoginUserId(null);
                setDisplayName("로그인 후 이용해주세요.");
            }
        };
        fetchLoginUser();
    }, []);

    // 게시글 불러오기
    useEffect(() => {

        const postId = id ?? searchParams.get("id"); // ✅ props 없으면 URL에서 읽기

    if (!postId) {
      console.error("postId is missing");
      setLoading(false);              // ✅ 무한로딩 방지
      return;
    }
        const fetchPostData = async () => {
            const postId = id;  // searchParams를 사용한 id 가져오기
            if (!postId) return;

            try {
                setLoading(true);  // 데이터 로딩 시작
                const res = await fetch(`/api/community/${postId}`);
                const data = await res.json();
                if (data?.post) {
                    setPostData(data.post);
                } else {
                    throw new Error("게시글을 찾을 수 없습니다.");
                }
            } catch (err) {
                console.error(err);
                alert("게시글을 불러오는 중 오류 발생: " + err.message);
                router.push("/Community_list");
            } finally {
                setLoading(false);  // 데이터 로딩 완료
            }
        };

        fetchPostData();
    }, [id, router]);  // searchParams가 변경될 때마다 실행

    const { title, content, images, category, authorName } = postData;
    const getImageSrc = (img) => (img ? `/uploads/${img}` : null);

    const mainImage = images && images.length > 0 ? getImageSrc(images[0]) : null;
    const thumbnails = images && images.length > 1 ? images.slice(1, 4).map(getImageSrc) : [];

    // 게시글 삭제 함수
    const handleDelete = async () => {
        if (String(loginUserId) !== String(postData.authorId)) {
            alert("자신의 글만 삭제할 수 있습니다.");
            return;
        }
        if (!confirm("정말로 이 게시글을 삭제하시겠습니까?")) return;

        try {
            const res = await fetch(`/api/community/${postData._id}`, {
                method: "DELETE",
                headers: { "x-user-id": String(loginUserId || "") },
            });

            if (!res.ok) throw new Error("게시글 삭제 실패");

            alert("게시글이 삭제되었습니다.");
            router.push("/Community_list");
        } catch (err) {
            console.error(err);
            alert("삭제 중 오류: " + (err.message || "알 수 없는 오류"));
        }
    };

    // 게시글 수정 버튼
    const handleEdit = () => {
        if (String(loginUserId) !== String(postData.authorId)) {
            alert("자신의 글만 수정할 수 있습니다.");
            return;
        }
        router.push(`/Community_edit?id=${postData._id}`);
    };

    return (
        <>
            <Header2 />
            <div className={styles.container_post}>
                <div className={styles.titleBox_post}>
                    <h2 className={styles.title_post}>게시글</h2>
                    <div className={styles.titleLine_post}></div>
                </div>

                {/* 로딩 중일 때 메시지 표시 */}
                {loading ? (
                    <div className={styles.loadingBox}>게시글을 불러오는 중...</div>
                ) : (
                    <div className={styles.contentRow_post} ref={contentRowRef}>
                        <div className={styles.imageArea_post}>
                            {mainImage ? (
                                <img
                                    src={mainImage}
                                    alt="대표 이미지"
                                    style={{
                                        width: "100%",
                                        height: "400px",
                                        objectFit: "cover",
                                        objectPosition: "center",
                                        borderRadius: "12px",
                                    }}
                                />
                            ) : (
                                <div className={styles.noImageBox_post}>이미지가 없습니다.</div>
                            )}

                            <div className={styles.thumbnailRow_post} style={{ gap: "10px" }}>
                                {Array.from({ length: 3 }).map((_, idx) => {
                                    const img = thumbnails[idx];
                                    return img ? (
                                        <img
                                            key={idx}
                                            src={img}
                                            alt={`썸네일 ${idx + 1}`}
                                            style={{
                                                width: `calc((100% - 20px) / 3)`,
                                                height: "100px",
                                                objectFit: "cover",
                                                objectPosition: "center",
                                                borderRadius: "8px",
                                            }}
                                        />
                                    ) : (
                                        <div
                                            key={idx}
                                            className={styles.noThumb_post}
                                            style={{
                                                width: `calc((100% - 20px) / 3)`,
                                                height: "100px",
                                            }}
                                        >
                                            <span>이미지가 없습니다.</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className={styles.textArea_post}>
                            <div className={styles.profileRow_post}>
                                <div className={styles.profileBox_post}>
                                    <div className={styles.profileCircle_post}></div>
                                    <p className={styles.username_post}>
                                        {authorName || displayName || "익명"}
                                    </p>
                                </div>
                                <span className={styles.category_post}>
                                    {category || "카테고리 없음"}
                                </span>
                            </div>

                            <h3 className={styles.postTitle_post}>
                                {title || "제목이 없습니다."}
                            </h3>
                            <p className={styles.postContent_post}>
                                {content || "내용이 없습니다."}
                            </p>
                        </div>
                    </div>
                )}

                <div className={styles.actionIcons_post}>
                    <FontAwesomeIcon icon={faHeart} />
                    <FontAwesomeIcon
                        icon={faTrash}
                        onClick={handleDelete} // 🔥 자기 글 체크 포함
                        style={{ cursor: "pointer" }}
                    />
                    <FontAwesomeIcon
                        icon={faPen}
                        style={{ cursor: "pointer" }}
                        onClick={handleEdit} // 🔥 자기 글 체크 포함
                    />
                </div>

                <div
                    className={styles.endLine_post}
                    style={{
                        height: "2px",
                        backgroundColor: "#f7931e",
                        marginTop: "10px",
                        width: "100%",
                        maxHeight: contentHeight ? `${contentHeight}px` : "auto",
                    }}
                ></div>

                <div className={styles.bottomBtnBox_post}>
                    <button
                        className={styles.listBtn_post}
                        onClick={() => router.push("/Community_list")}
                    >
                        목록으로
                    </button>
                </div>
            </div>
            <Footer2 />
        </>
    );
}
