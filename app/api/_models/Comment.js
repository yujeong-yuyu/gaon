// app/api/_models/Comment.js
import mongoose, { Schema } from "mongoose";

const CommentSchema = new Schema(
    {
        post: {
            type: Schema.Types.ObjectId,
            ref: "Post", // 어떤 글에 달린 댓글인지
            required: true,
        },
        author: {
            type: Schema.Types.ObjectId,
            ref: "User", // 댓글 작성자
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
    },
    { timestamps: true, versionKey: false }
);

export default mongoose.models.Comment || mongoose.model("Comment", CommentSchema);
