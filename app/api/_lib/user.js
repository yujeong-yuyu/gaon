// app/api/_lib/user.js
import User from "@/app/api/_models/User";

/**
 * 소셜 upsert with email-merge
 * - 1) (provider, providerId)로 우선 조회
 * - 2) 없으면 검증된 email로 기존 계정 연결(merge 로그인)
 * - 3) 그래도 없으면 새로 생성(이때만 대체 이메일 사용)
 */
export async function upsertSocialUser(provider, { providerId, email, name, avatar }) {
    // 1) 기존 소셜 계정?
    let user = await User.findOne({ provider, providerId }).lean();
    if (user) return user;

    // 2) 이메일로 기존 유저 연결(merge)
    if (email) {
        const byEmail = await User.findOne({ email }).lean();
        if (byEmail) {
            // 빈 값만 보강(파괴적 덮어쓰기 방지)
            const patch = {};
            if (!byEmail.name && name) patch.name = name;
            if (!byEmail.avatar && avatar) patch.avatar = avatar;

            if (Object.keys(patch).length) {
                await User.updateOne({ _id: byEmail._id }, { $set: patch });
            }
            // 👉 새 문서 생성하지 않고 기존 사용자로 로그인 처리
            return await User.findById(byEmail._id).lean();
        }
    }

    // 3) 완전 신규 소셜 사용자 생성
    const safeEmail = email || `${providerId}@${provider}.local`; // 가짜 이메일은 여기에서만 사용
    const created = await User.create({
        provider,
        providerId,
        email: safeEmail,
        ...(name ? { name } : {}),
        ...(avatar ? { avatar } : {}),
    });

    return created.toObject ? created.toObject() : created;
}
