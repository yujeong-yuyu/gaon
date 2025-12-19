import styles from "@/styles/c-css/Footer.module.css";

export default function Footer() {
  return (
    <div className={styles.wrapFT}>
      <div className={styles.ftcontainerFT}>
        <div className={styles.conbox1FT}>
          <span className={styles.fttitleFT}>수강 문의하기</span>
          <span className={styles.ftsubFT}>
            가온,&nbsp;&nbsp;반려동물 평생 교육원
            <br />
            평생 반려견과 함께 행복할 수 있도록
            <br />
            따뜻하게 가르칩니다.
          </span>
          <div className={styles.lineFT}></div>
          <span className={styles.phoneFT}>
            대표전화&nbsp;&nbsp;:&nbsp;&nbsp;000-0000-0000
          </span>
          <span className={styles.infoFT}>
            상호&nbsp;&nbsp;:&nbsp;&nbsp;가온
            <br />
            주소&nbsp;&nbsp;:&nbsp;&nbsp;경기도 안산시 상록구 광덕1로 375,
            강우빌딩 5층
          </span>
        </div>
        <div className={styles.conbox2FT}>
          <form action="#" className={styles.classformFT}>
            <label htmlFor="nameFT">이름</label>
            <input
              type="text"
              name="nameFT"
              className={styles.nameFT}
              placeholder="이름을 입력해주세요"
            />
            <label htmlFor="phonenumberFT">연락처</label>
            <input
              type="number"
              name="phonenumberFT"
              className={styles.phonenumberFT}
              placeholder="연락처를 입력해주세요"
            />
            <label htmlFor="classFT">수강 희망 강의</label>
            <select name="classFT" className={styles.classFT}>
              <option value="">강의를 선택해주세요</option>
              <option value="1">-----------------------------------------------------------------------------------------------------------------------------------</option>
              <option value="2">퍼피 기초 교육</option>
              <option value="3">사회화 훈련</option>
              <option value="4">산책 매너 훈련</option>
              <option value="5">목욕 & 그루밍</option>
              <option value="6">반려동물 배변훈련</option>
            </select>
            <div className={styles.submitboxFT}>
              <div className={styles.sbinputboxFT}>
                <input type="checkbox" name="checkboxFT" id="checkboxFT" />
                <label htmlFor="checkboxFT">개인정보처리방침 약관동의</label>
              </div>
              <button type="submit" className={styles.submitbtnFT}>
                신청하기
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
