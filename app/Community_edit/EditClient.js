// Community_edit/EditClient.js
"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Header2 from "@/components/Header2";
import Footer2 from "@/components/Footer2";
import styles from "@/styles/p-css/Community_edit.module.css";

export default function EditClient({ postId }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const realPostId = postId || searchParams.get("id"); // ✅ 강제 보정

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [category, setCategory] = useState("강사후기");
    const [images, setImages] = useState(Array(4).fill(null));     // 미리보기/파일명
    const [imageFiles, setImageFiles] = useState(Array(4).fill(null)); // 실제 업로드 파일

    // 기존 게시글 불러오기
    useEffect(() => {
        if (!realPostId) return; // 새 글 모드로도 쓸 수 있게 가드

        const fetchPost = async () => {
            try {
                const res = await fetch(`/api/community/${realPostId}`, { cache: "no-store" });
                if (!res.ok) throw new Error("게시글 조회 실패");
                const data = await res.json();
                const post = data.post;
                if (!post) {
                    alert("게시글이 존재하지 않습니다.");
                    router.push("/Community_list");
                    return;
                }

                setTitle(post.title || "");
                setContent(post.content || "");
                setCategory(post.category || "강사후기");

                const imgs = post.images || [];
                setImages(imgs.concat(Array(4 - imgs.length).fill(null)).slice(0, 4));
            } catch (err) {
                console.error(err);
                alert("게시글 불러오기 실패");
                router.push("/Community_list");
            }
        };
        fetchPost();
    }, [realPostId, router]);

    const getImageSrc = (img) => (img ? `/uploads/${img}` : null);

    // 이미지 선택
    const handleImageChange = (e, index) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const newFiles = [...imageFiles];
        newFiles[index] = file;
        setImageFiles(newFiles);

        const reader = new FileReader();
        reader.onloadend = () => {
            const newImages = [...images];
            newImages[index] = reader.result; // data URL 미리보기
            setImages(newImages);
        };
        reader.readAsDataURL(file);
    };

    const handleDelete = (index) => {
        const newImages = [...images];
        newImages[index] = null;
        setImages(newImages);

        const newFiles = [...imageFiles];
        newFiles[index] = null;
        setImageFiles(newFiles);
    };

    const renderImageBoxes = () =>
        images.map((img, index) => (
            <div
                key={index}
                className={`${styles.imageBox_edit} ${!img ? styles.addBox_edit : styles.filledBox_edit}`}
                onClick={() => !img && document.getElementById(`fileInputEdit-${index}`).click()}
            >
                {img ? (
                    <>
                        <img
                            src={typeof img === "string" && !img.startsWith("data:") ? getImageSrc(img) : img}
                            alt={`preview-${index}`}
                        />
                        <button
                            type="button"
                            className={styles.deleteBtn_edit}
                            onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(index);
                            }}
                        >
                            −
                        </button>
                    </>
                ) : (
                    <span className={styles.plusSign_edit}>+</span>
                )}
                <input
                    id={`fileInputEdit-${index}`}
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={(e) => handleImageChange(e, index)}
                />
            </div>
        ));

  const handleSubmit = async () => {
  try {
    if (!realPostId) {
      alert("잘못된 접근입니다. (id 없음)");
      return;
    }

    console.log("edit id (before fetch):", realPostId); // ✅ 먼저 찍기

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("category", category);

    const keepExisting = images.filter(
      (v) => typeof v === "string" && v && !String(v).startsWith("data:")
    );
    formData.append("keepExisting", JSON.stringify(keepExisting));
    imageFiles.forEach((file) => file && formData.append("images", file));

    const res = await fetch(`/api/community/community_edit?id=${realPostId}`, {
      method: "POST",
      body: formData,
      credentials: "include",
    });

    const data = await res.json().catch(() => ({}));

    console.log("edit response status:", res.status); // ✅ 핵심
    console.log("edit response data:", data);         // ✅ 핵심

    if (!res.ok) throw new Error(data?.error || "수정 실패");

    alert("게시글 수정 완료!");
    router.push(`/Community_post?id=${realPostId}`);
  } catch (err) {
    console.error(err);
    alert(err.message || "에러가 발생했습니다.");
  }
};

    return (
        <>
            <Header2 />
            <div className={styles.container_edit}>
                <div className={styles.titleBox_edit}>
                    <h2 className={styles.title_edit}>글 수정하기</h2>
                    <div className={styles.titleLine_edit}></div>
                </div>

                <div className={styles.formWrapper_edit}>
                    <div className={styles.inputRow_edit}>
                        <input
                            type="text"
                            placeholder="제목을 수정해주세요."
                            className={styles.titleInput_edit}
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                        <select
                            className={styles.selectBox_edit}
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        >
                            <option>강사후기</option>
                            <option>멍스타그램</option>
                            <option>그룹신청</option>
                            <option>QnA</option>
                        </select>
                    </div>

                    <textarea
                        className={styles.textarea_edit}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />

                    <div className={styles.imageUpload_edit}>{renderImageBoxes()}</div>

                    <button className={styles.submitBtn_edit} onClick={handleSubmit}>
                        수정 완료
                    </button>
                </div>
            </div>
            <Footer2 />
        </>
    );
}
