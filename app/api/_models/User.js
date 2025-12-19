// app/api/_models/User.js
import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema(
    {
        // 가입 방식
        provider: {
            type: String,
            enum: ["credentials", "kakao", "google", "naver"],
            required: true,
            index: true,
        },

        // 소셜로그인 식별자 (kakao/google/naver에서 내려주는 id)
        providerId: { type: String, index: true },

        // ✅ 아이디 로그인(일반가입)용 필드
        id: { type: String, trim: true },

        // 이메일(선택: 소셜이 주거나, 별도로 수집할 때)
        email: { type: String, trim: true, lowercase: true },

        // 일반 회원가입 전용
        passwordHash: { type: String },

        // 공통 프로필
        name: { type: String, trim: true },
        avatar: { type: String, trim: true },
        // ✅ 선택 필드
        nickname: { type: String, trim: true },     // ✅
        username: { type: String, trim: true },     // ✅
        displayName: { type: String, trim: true },  // ✅
        // 권한
        role: { type: String, enum: ["user", "admin"], default: "user" },
    },
    { timestamps: true, versionKey: false }
);

/**
 * 인덱스 & 유니크 정책
 *
 * 1) 소셜: (provider, providerId) 조합 유니크
 * 2) 일반가입(credentials): id 유니크 (email은 선택값)
 */
UserSchema.index({ provider: 1, providerId: 1 }, { unique: true, sparse: true });

// ✅ credentials 전용 id 유니크 (id가 문자열일 때만)
UserSchema.index(
    { id: 1 },
    {
        unique: true,
        sparse: true,
        partialFilterExpression: { provider: "credentials", id: { $type: "string" } },
    }
);

// (선택) 이메일도 유니크하고 싶다면 유지
UserSchema.index(
    { email: 1 },
    {
        unique: true,
        sparse: true,
        // 이메일은 소셜/일반 모두에서 "있을 수도" 있으므로 partial로만 제한
        partialFilterExpression: { email: { $type: "string" } },
    }
);

// ✅ 최소 가드: credentials 계정은 id + passwordHash 필수
UserSchema.pre("validate", function (next) {
    if (this.provider === "credentials") {
        if (!this.id) return next(new Error("id is required for credentials"));
        if (!this.passwordHash) return next(new Error("passwordHash is required for credentials"));
    }
    next();
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
