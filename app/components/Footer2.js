import styles from "@/styles/c-css/Footer2.module.css";
import responsive from "@/styles/C-response/response-Footer2.module.css";

export default function Footer2() {
  return (
    <div className={`${styles.wrapFT2} ${responsive.wrapFT2}`}>
      <div className={`${styles.containerFT2} ${responsive.containerFT2}`}>
        <div className={`${styles.topbox} ${responsive.topbox}`}>
          <img
            src="https://kjwon2025.github.io/gaonimg/img/logofront1.png"
            alt="logo"
          />
          <div className={`${styles.spanboxFT2} ${responsive.spanboxFT2}`}>
            <span>회사소개&nbsp;&nbsp;|</span>
            <span>인재채용&nbsp;&nbsp;|</span>
            <span>이용약관&nbsp;&nbsp;|</span>
            <span>개인정보 취급방침&nbsp;&nbsp;|</span>
            <span>이용안내</span>
          </div>
        </div>

        <div className={`${styles.bottombox} ${responsive.bottombox}`}>
          <span>대표전화.&nbsp;&nbsp;0000-0000</span>
          <span>2025.&nbsp;&nbsp;Gaon all rights reserved.</span>

          <div className={`${styles.snsboxFT2} ${responsive.snsboxFT2}`}>
            <div>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14c-.326-.043-1.557-.14-2.857-.14C11.928 2 10 3.657 10 6.7v2.8H7v4h3V22h4z"
                />
              </svg>
            </div>
            <div>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <circle
                  cx="17"
                  cy="7"
                  r="1.5"
                  fill="currentColor"
                  fillOpacity="0"
                >
                  <animate
                    fill="freeze"
                    attributeName="fill-opacity"
                    begin="1.3s"
                    dur="0.15s"
                    values="0;1"
                  />
                </circle>
                <g
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                >
                  <path
                    strokeDasharray="72"
                    strokeDashoffset="72"
                    d="M16 3c2.76 0 5 2.24 5 5v8c0 2.76 -2.24 5 -5 5h-8c-2.76 0 -5 -2.24 -5 -5v-8c0 -2.76 2.24 -5 5 -5h4Z"
                  >
                    <animate
                      fill="freeze"
                      attributeName="stroke-dashoffset"
                      dur="0.6s"
                      values="72;0"
                    />
                  </path>
                  <path
                    strokeDasharray="28"
                    strokeDashoffset="28"
                    d="M12 8c2.21 0 4 1.79 4 4c0 2.21 -1.79 4 -4 4c-2.21 0 -4 -1.79 -4 -4c0 -2.21 1.79 -4 4 -4"
                  >
                    <animate
                      fill="freeze"
                      attributeName="stroke-dashoffset"
                      begin="0.7s"
                      dur="0.6s"
                      values="28;0"
                    />
                  </path>
                </g>
              </svg>
            </div>
            <div>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="m10 15l5.19-3L10 9zm11.56-7.83c.13.47.22 1.1.28 1.9c.07.8.1 1.49.1 2.09L22 12c0 2.19-.16 3.8-.44 4.83c-.25.9-.83 1.48-1.73 1.73c-.47.13-1.33.22-2.65.28c-1.3.07-2.49.1-3.59.1L12 19c-4.19 0-6.8-.16-7.83-.44c-.9-.25-1.48-.83-1.73-1.73c-.13-.47-.22-1.1-.28-1.9c-.07-.8-.1-1.49-.1-2.09L2 12c0-2.19.16-3.8.44-4.83c.25-.9.83-1.48 1.73-1.73c.47-.13 1.33-.22 2.65-.28c1.3-.07 2.49-.1 3.59-.1L12 5c4.19 0 6.8.16 7.83.44c.9.25 1.48.83 1.73 1.73"
                />
              </svg>
            </div>
            <div>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="m17.687 3.063l-4.996 5.711l-4.32-5.711H2.112l7.477 9.776l-7.086 8.099h3.034l5.469-6.25l4.78 6.25h6.102l-7.794-10.304l6.625-7.571zm-1.064 16.06L5.654 4.782h1.803l10.846 14.34z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
