// utils/chatMatcher.js
// 문자열 정규화: 공백 제거 + 소문자
export const normalize = (s = "") => s.replace(/\s+/g, "").toLowerCase();

/** 
 * 입력문으로 적합한 답변 찾기
 * - item.keyword: 문자열 또는 문자열 배열
 * - 가장 '긴' 키워드가 일치하는 항목을 우선 선택
 */
export function findResponse(input, data) {
  if (!data) return "";
  const q = normalize(input);
  let best = null;

  for (const item of data.responses || []) {
    const keys = Array.isArray(item.keyword) ? item.keyword : [item.keyword];
    for (const k of keys) {
      const nk = normalize(k);
      if (!nk) continue;
      const hit = q.indexOf(nk) !== -1;
      if (hit) {
        const score = nk.length; // 긴 키워드 우선
        if (!best || score > best.score) best = { resp: item.response, score };
      }
    }
  }
  return best ? best.resp : (data.defaultResponse || "");
}
