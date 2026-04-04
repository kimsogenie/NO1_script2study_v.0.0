import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="ko">
      <Head>
        {/* ── Google Analytics ── */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-SKMH27X4ZX" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-SKMH27X4ZX');
            `,
          }}
        />

        {/* ── 카카오 공유 SDK ── */}
        <script src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js" crossOrigin="anonymous" />

        {/* ── PWA ── */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#D4849A" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Script2Study" />
        <link rel="apple-touch-icon" href="/icon-192.png" />

        {/* ── SEO 기본 ── */}
        <meta name="description" content="영어 스크립트를 붙여넣으면 문장 해석, 핵심 표현, 암기장, 쉐도잉, 워크북까지 자동으로 만들어주는 AI 영어 학습 교재 생성기" />
        <meta name="keywords" content="영어 공부, 영어 스크립트, 쉐도잉, 영어 교재, AI 영어, 팟캐스트 영어, 유튜브 영어, 영어 학습, 영어회화" />
        <meta name="author" content="kimsogenie" />
        <meta name="robots" content="index, follow" />

        {/* ── Canonical ── */}
        <link rel="canonical" href="https://no-1-script2study-v-0-0.vercel.app/" />

        {/* ── Open Graph ── */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Script2Study — AI 영어 교재 자동 생성기" />
        <meta property="og:description" content="좋아하는 영어 콘텐츠 스크립트로 나만의 학습 교재를 자동으로 만들어드려요. 해석·표현·암기장·쉐도잉·퀴즈까지 한 번에!" />
        <meta property="og:url" content="https://no-1-script2study-v-0-0.vercel.app" />
        <meta property="og:image" content="https://no-1-script2study-v-0-0.vercel.app/icon-512.png" />
        <meta property="og:locale" content="ko_KR" />
        <meta property="og:site_name" content="Script2Study" />

        {/* ── Twitter Card ── */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Script2Study — AI 영어 교재 자동 생성기" />
        <meta name="twitter:description" content="영어 스크립트를 붙여넣으면 해석·표현·암기장·쉐도잉·워크북까지 자동 생성!" />
        <meta name="twitter:image" content="https://no-1-script2study-v-0-0.vercel.app/icon-512.png" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
