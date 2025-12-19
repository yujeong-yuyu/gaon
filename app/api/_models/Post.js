// app/api/_models/Post.js
import mongoose, { Schema } from "mongoose";

const PostSchema = new Schema(
    {
        author: { type: Schema.Types.ObjectId, ref: "User", required: true },
        title: { type: String, required: true, trim: true },
        content: { type: String, required: true },
        category: { type: String, default: "게시판 선택" },
        images: [{ type: String }],
        tags: [{ type: String }],
        likeCount: { type: Number, default: 0 },
        commentCount: { type: Number, default: 0 },
    },
    { timestamps: true, versionKey: false }
);

// ✅ 텍스트 인덱스(배열 제외)
PostSchema.index({ title: "text", content: "text" });

// ✅ 일반 인덱스
PostSchema.index({ tags: 1 });
PostSchema.index({ createdAt: -1 });

// ① 'community' 컬렉션을 쓴다면:
export default mongoose.models.Post || mongoose.model("Post", PostSchema, "community");