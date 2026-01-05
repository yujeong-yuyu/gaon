"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Header2 from "@/components/Header2";
import Footer2 from "@/components/Footer2";
import styles from "@/styles/p-css/Community_post.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faTrash, faPen } from "@fortawesome/free-solid-svg-icons";

export default function CommunityPostClient({ id }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [postData, setPostData] = useState(null);

  const [postLoading, setPostLoading] = useState(true);

  const [loginUserId, setLoginUserId] = useState(null);
  const [displayName, setDisplayName] = useState(null);

  // ✅ 세션 가져오기 (로딩 분리)
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/session", { credentials: "include", cache: "no-store" });
        const data = await res.json();
        const u = data?.user;

        setLoginUserId(u?.uid || null);
        const showName = u?.displayName || u?.nickname || u?.name || u?.username || u?.id || "사용자";
        setDisplayName(data?.ok ? showName : null);
      } catch {
        setLoginUserId(null);
        setDisplayName(null);
      }
    };
    fetchUser();
  }, []);

  // ✅ 게시글 가져오기 (id fallback 확실하게)
  useEffect(() => {
    const postId = id ?? searchParams.get("id");

    if (!postId) {
      console.error("postId is missing");
      setPostLoading(false);
      return;
    }

    const fetchPostData = async () => {
      try {
        setPostLoading(true);
        const res = await fetch(`/api/community/${postId}`, { cache: "no-store" });
        if (!res.ok) throw new Error(`게시글 조회 실패: ${res.status}`);
        const data = await res.json();
        if (!data?.post) throw new Error("post가 없습니다.");
        setPostData(data.post);
      } catch (err) {
        console.error(err);
        alert("게시글을 불러오는 중 오류 발생: " + err.message);
        router.push("/Community_list");
      } finally {
        setPostLoading(false);
      }
    };

    fetchPostData();
  }, [id, searchParams, router]);

  // ---------- 렌더 ----------
  if (postLoading) {
    return (
      <>
        <Header2 />
        <div className={styles.container_post}>
          <div className={styles.loadingBox}>게시글을 불러오는 중...</div>
        </div>
        <Footer2 />
      </>
    );
  }

  if (!postData) {
    return (
      <>
        <Header2 />
        <div className={styles.container_post}>
          <div className={styles.loadingBox}>게시글이 없습니다.</div>
        </div>
        <Footer2 />
      </>
    );
  }

  const { title, content, images = [], category, authorName, authorId, _id } = postData;

  const getImageSrc = (img) => (img ? `/uploads/${img}` : null);
  const mainImage = images.length > 0 ? getImageSrc(images[0]) : null;
  const thumbnails = images.length > 1 ? images.slice(1, 4).map(getImageSrc) : [];

  const handleDelete = async () => {
    if (String(loginUserId) !== String(authorId)) {
      alert("자신의 글만 삭제할 수 있습니다.");
      return;
    }
    if (!confirm("정말로 이 게시글을 삭제하시겠습니까?")) return;

    try {
      const res = await fetch(`/api/community/${_id}`, {
        method: "DELETE",
       credentials: "include",
      });
      if (!res.ok) throw new Error("게시글 삭제 실패");
      alert("게시글이 삭제되었습니다.");
      router.push("/Community_list");
    } catch (err) {
      console.error(err);
      alert("삭제 중 오류: " + (err.message || "알 수 없는 오류"));
    }
  };

  const handleEdit = () => {
    if (String(loginUserId) !== String(authorId)) {
      alert("자신의 글만 수정할 수 있습니다.");
      return;
    }
    router.push(`/Community_edit?id=${_id}`);
  };

  return (
    <>
      <Header2 />
      <div className={styles.container_post}>
        <div className={styles.titleBox_post}>
          <h2 className={styles.title_post}>게시글</h2>
          <div className={styles.titleLine_post}></div>
        </div>

        <div className={styles.contentRow_post}>
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
                <p className={styles.username_post}>{authorName || displayName || "익명"}</p>
              </div>
              <span className={styles.category_post}>{category || "카테고리 없음"}</span>
            </div>

            <h3 className={styles.postTitle_post}>{title || "제목이 없습니다."}</h3>
            <p className={styles.postContent_post}>{content || "내용이 없습니다."}</p>
          </div>
        </div>

        <div className={styles.actionIcons_post}>
          <FontAwesomeIcon icon={faHeart} />
          <FontAwesomeIcon icon={faTrash} onClick={handleDelete} style={{ cursor: "pointer" }} />
          <FontAwesomeIcon icon={faPen} onClick={handleEdit} style={{ cursor: "pointer" }} />
        </div>

        <div className={styles.bottomBtnBox_post}>
          <button className={styles.listBtn_post} onClick={() => router.push("/Community_list")}>
            목록으로
          </button>
        </div>
      </div>
      <Footer2 />
    </>
  );
}
