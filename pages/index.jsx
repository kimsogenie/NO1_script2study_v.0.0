import { useState, useEffect, useCallback, useRef } from "react";
import Head from "next/head";

const VERSION = "v0.9.1";
const COPYRIGHT = `© 2025 kimsogenie. All rights reserved.`;
const MAX_RECENT = 5;

const QUOTES = [
  { ko: "시작은 반이 아니다. 시작은 시작일 뿐이다." },
  { ko: "열심히 한다고 다 되는 게 아니다. 잘해야 한다." },
  { ko: "성공은 99%의 빽과 1%의 재능으로 이루어진다." },
  { ko: "개천에서 용 난 사람 만나기 힘들다. 개천에서 용 쓰면 미꾸라지 된다." },
  { ko: "참을 인(忍) 세 번이면 호구 된다." },
  { ko: "가는 말이 고우면 얕본다." },
  { ko: "내 너 그럴 줄 알았다. 알았으면 제발 미리 말해줘라." },
  { ko: "티끌 모아 티끌이다." },
  { ko: "나까지 나설 필요 없다." },
  { ko: "선행은 몰래 할 필요가 없다. 대놓고 해라. 그래야 생색도 내고 알아준다." },
  { ko: "어려운 길은 길이 아니다." },
  { ko: "효도는 셀프다." },
  { ko: "안 되면 말고." },
  { ko: "내가 나를 안 아끼면 아무도 나를 안 아껴준다." },
  { ko: "한 번 인생은 나를 위해 사는 거다." },
  { ko: "돈이 전부는 아니지만, 그만한 게 없다." },
  { ko: "예술은 비싸고 인생은 더럽다." },
  { ko: "고생 끝에 낙이 오는 게 아니라, 고생 끝에 골병 난다." },
  { ko: "세상은 넓고 할 일은 많지 않다. 할 일은 정해져 있다." },
];

function useTTS() {
  const [speaking, setSpeaking] = useState(null);
  const synthRef = useRef(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      synthRef.current = window.speechSynthesis;
      synthRef.current?.getVoices();
      if (window.speechSynthesis.onvoiceschanged !== undefined)
        window.speechSynthesis.onvoiceschanged = () => {};
    }
  }, []);

  const speak = useCallback((text, id) => {
    const synth = synthRef.current || (typeof window !== "undefined" ? window.speechSynthesis : null);
    if (!synth) return;
    synth.cancel();
    if (speaking === id) { setSpeaking(null); return; }
    const trySpeak = () => {
      const u = new SpeechSynthesisUtterance(text);
      u.lang = "en-US"; u.rate = 0.88; u.pitch = 1; u.volume = 1;
      const voices = synth.getVoices();
      const en = voices.find(v => v.lang === "en-US" && /Samantha|Karen|Daniel/i.test(v.name))
        || voices.find(v => v.lang === "en-US")
        || voices.find(v => v.lang.startsWith("en"));
      if (en) u.voice = en;
      u.onstart = () => setSpeaking(id);
      u.onend = () => setSpeaking(null);
      u.onerror = () => setSpeaking(null);
      synth.speak(u);
    };
    if (synth.getVoices().length === 0) setTimeout(trySpeak, 300);
    else trySpeak();
  }, [speaking]);

  const stop = useCallback(() => { synthRef.current?.cancel(); setSpeaking(null); }, []);
  return { speak, stop, speaking };
}

const G = `
@import url('https://fonts.googleapis.com/css2?family=Pretendard:wght@300;400;500;600;700;800&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
:root{
  --bg:#E8E8E8;--win:#FFFFFF;--sidebar:#F0F0F0;--sidebar-border:#E0E0E0;
  --panel:#F7F7F7;--ink:#1A1A1A;--ink2:#3C3C3C;--ink3:#7A7A7A;--ink4:#ADADAD;
  --blue:#4A90D9;--blue-light:rgba(74,144,217,0.12);
  --pink:#E8A0B0;--pink-light:rgba(232,160,176,0.15);--pink-mid:#D4849A;
  --border:rgba(0,0,0,0.08);
  --shadow:0 8px 32px rgba(0,0,0,0.12),0 2px 8px rgba(0,0,0,0.06);
  --shadow-sm:0 1px 4px rgba(0,0,0,0.08);--r:10px;
}
html,body{min-height:100%;font-family:'Pretendard',-apple-system,BlinkMacSystemFont,'Apple SD Gothic Neo',sans-serif;
  background:var(--bg);color:var(--ink);-webkit-font-smoothing:antialiased;}

.input-screen{min-height:100vh;display:flex;align-items:flex-start;justify-content:center;padding:32px 20px;background:var(--bg);}
@media(max-width:600px){.input-screen{padding:16px 12px;}}

.finder-window{width:100%;max-width:640px;background:var(--win);border-radius:16px;box-shadow:var(--shadow);overflow:hidden;border:1px solid rgba(255,255,255,0.9);}
@media(max-width:600px){.finder-window{border-radius:14px;}}

.titlebar{height:40px;background:var(--sidebar);border-bottom:1px solid var(--sidebar-border);display:flex;align-items:center;padding:0 14px;gap:7px;}
.dot{width:12px;height:12px;border-radius:50%;flex-shrink:0;}
.dot-r{background:#FF5F57;}.dot-y{background:#FEBC2E;}.dot-g{background:#28C840;}
.titlebar-name{flex:1;text-align:center;font-size:13px;font-weight:500;color:var(--ink3);margin-left:-36px;}

.finder-body{display:flex;}

.sidebar{width:160px;flex-shrink:0;background:var(--sidebar);border-right:1px solid var(--sidebar-border);padding:16px 0;}
@media(max-width:600px){.sidebar{display:none;}}

.sb-section{margin-bottom:18px;}
.sb-label{font-size:11px;font-weight:700;color:var(--ink3);padding:0 14px 6px;text-transform:uppercase;letter-spacing:.07em;}
.sb-item{display:flex;align-items:center;gap:9px;padding:6px 14px;font-size:14px;font-weight:500;color:var(--ink2);cursor:pointer;transition:background .15s;}
.sb-item:hover{background:rgba(0,0,0,.04);}
.sb-item.active{background:var(--pink-light);color:var(--pink-mid);font-weight:600;}
.sb-icon{font-size:15px;width:20px;text-align:center;flex-shrink:0;}
.sb-badge{margin-left:auto;font-size:11px;font-weight:700;color:var(--pink-mid);background:var(--pink-light);border-radius:99px;padding:1px 6px;}

.main-panel{flex:1;padding:28px 28px 32px;min-width:0;}
@media(max-width:600px){.main-panel{padding:22px 18px 28px;}}

.main-eyebrow{font-size:13px;color:var(--ink3);margin-bottom:2px;}
.main-title{font-size:28px;font-weight:800;color:var(--ink);letter-spacing:-.03em;margin-bottom:22px;}
@media(max-width:600px){.main-title{font-size:24px;}}

.field{margin-bottom:14px;}
.lbl{display:block;font-size:12px;font-weight:600;color:var(--ink3);margin-bottom:6px;}
.inp{width:100%;padding:11px 13px;background:var(--win);border:1.5px solid var(--border);border-radius:8px;font-size:15px;font-family:inherit;color:var(--ink);outline:none;transition:border-color .2s,box-shadow .2s;}
.inp:focus{border-color:var(--pink-mid);box-shadow:0 0 0 3px var(--pink-light);}
.inp::placeholder{color:var(--ink4);}
.ta{height:160px;resize:vertical;line-height:1.6;}
@media(max-width:600px){.ta{height:140px;}}
.cnt{font-size:12px;color:var(--ink4);text-align:right;margin-top:4px;}

.btn-gen{width:100%;padding:14px;background:var(--pink-mid);color:#fff;border:none;border-radius:8px;font-size:15px;font-weight:700;font-family:inherit;cursor:pointer;letter-spacing:-.01em;transition:opacity .15s,transform .1s;margin-top:4px;box-shadow:0 2px 8px rgba(212,132,154,.4);}
.btn-gen:hover{opacity:.88;transform:translateY(-1px);}
.btn-gen:active{transform:translateY(0);}
.btn-gen:disabled{background:var(--ink4);box-shadow:none;cursor:not-allowed;transform:none;opacity:1;}

.err{font-size:13px;color:#E05555;text-align:center;margin-top:10px;}

.no-script-box{margin-top:20px;padding:18px;background:var(--panel);border-radius:12px;border:1px solid var(--sidebar-border);}
.no-script-title{font-size:14px;font-weight:700;color:var(--ink);margin-bottom:12px;display:flex;align-items:center;gap:6px;}
.script-method{display:flex;align-items:flex-start;gap:10px;padding:10px 12px;background:var(--win);border-radius:8px;margin-bottom:8px;border:1px solid var(--border);cursor:pointer;transition:box-shadow .15s;}
.script-method:hover{box-shadow:0 2px 8px rgba(0,0,0,.08);}
.script-method:last-child{margin-bottom:0;}
.sm-icon{font-size:20px;flex-shrink:0;margin-top:1px;}
.sm-title{font-size:13px;font-weight:700;color:var(--ink);margin-bottom:2px;}
.sm-desc{font-size:12px;color:var(--ink3);line-height:1.5;}
.sm-link{font-size:11px;color:var(--pink-mid);margin-top:3px;font-weight:600;}

/* ── 최근 교재 ── */
.mob-view-bar{display:none;gap:8px;padding-bottom:16px;}
@media(max-width:600px){.mob-view-bar{display:flex;}}
.mob-view-btn{flex:1;padding:10px;border-radius:8px;font-size:13px;font-weight:600;font-family:inherit;border:1.5px solid var(--sidebar-border);background:var(--win);color:var(--ink2);cursor:pointer;transition:all .15s;}
.mob-view-btn.active{background:var(--pink-light);border-color:var(--pink-mid);color:var(--pink-mid);}

.recent-empty{text-align:center;padding:48px 20px;color:var(--ink3);font-size:14px;line-height:1.8;}
.recent-empty-icon{font-size:40px;margin-bottom:12px;}
.recent-card{display:flex;align-items:center;gap:14px;padding:14px 16px;background:var(--win);border-radius:var(--r);border:1px solid var(--border);box-shadow:var(--shadow-sm);margin-bottom:9px;cursor:pointer;transition:box-shadow .15s,transform .15s;}
.recent-card:hover{box-shadow:0 4px 16px rgba(0,0,0,.1);transform:translateY(-1px);}
.recent-card-icon{font-size:28px;flex-shrink:0;}
.recent-card-body{flex:1;min-width:0;}
.recent-card-title{font-size:14px;font-weight:700;color:var(--ink);margin-bottom:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.recent-card-meta{font-size:12px;color:var(--ink3);}
.recent-card-del{flex-shrink:0;padding:5px 8px;background:none;border:none;font-size:14px;color:var(--ink4);cursor:pointer;border-radius:6px;transition:background .15s,color .15s;}
.recent-card-del:hover{background:rgba(255,59,48,.1);color:#FF3B30;}

/* ── LOADING ── */
.load-screen{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:18px;background:var(--bg);}
@keyframes bob{0%,100%{transform:translateY(0);}50%{transform:translateY(-8px);}}
.load-title{font-size:20px;font-weight:700;color:var(--ink);letter-spacing:-.02em;}
.load-bar{width:160px;height:3px;background:var(--sidebar-border);border-radius:99px;overflow:hidden;}
.load-bar-fill{height:100%;background:var(--pink-mid);border-radius:99px;animation:fill 1.5s ease-in-out infinite;}
@keyframes fill{0%{width:0%;margin-left:0;}60%{width:70%;margin-left:0;}100%{width:0%;margin-left:100%;}}
.load-quote{max-width:320px;text-align:center;padding:20px 24px;background:rgba(255,255,255,.85);border-radius:16px;border:1px solid rgba(0,0,0,.06);}
.load-quote-ko{font-size:15px;font-weight:700;color:var(--ink);line-height:1.7;margin-bottom:8px;}
.load-quote-author{font-size:12px;color:var(--ink3);font-weight:600;}
.load-pms{width:120px;height:120px;border-radius:50%;object-fit:cover;object-position:top;border:3px solid #fff;box-shadow:0 4px 16px rgba(0,0,0,.15);animation:bob 1.4s ease-in-out infinite;}

/* ── RESULT ── */
.result-wrap{min-height:100vh;background:var(--bg);}
.result-window{max-width:900px;margin:0 auto;background:var(--win);min-height:100vh;box-shadow:0 0 60px rgba(0,0,0,.12);display:flex;flex-direction:column;}
@media(min-width:900px){.result-window{min-height:auto;margin:32px auto;border-radius:16px;overflow:hidden;min-height:calc(100vh - 64px);}}

.res-titlebar{height:40px;background:var(--sidebar);border-bottom:1px solid var(--sidebar-border);display:flex;align-items:center;padding:0 14px;gap:7px;position:sticky;top:0;z-index:30;flex-shrink:0;}
.res-titlebar-name{flex:1;text-align:center;font-size:13px;font-weight:500;color:var(--ink3);margin-left:-36px;}
.res-header-btns{display:flex;gap:6px;position:absolute;right:14px;}
.btn-xs{padding:5px 12px;border-radius:6px;font-size:12px;font-weight:600;font-family:inherit;cursor:pointer;transition:opacity .15s;border:none;white-space:nowrap;}
.btn-xs-blue{background:var(--blue);color:#fff;}
.btn-xs-blue:hover{opacity:.85;}
.btn-xs-ghost{background:rgba(0,0,0,.07);color:var(--ink2);}
.btn-xs-ghost:hover{background:rgba(0,0,0,.11);}

.mob-tabs{display:none;background:var(--sidebar);border-bottom:1px solid var(--sidebar-border);overflow-x:auto;-webkit-overflow-scrolling:touch;scrollbar-width:none;flex-shrink:0;}
.mob-tabs::-webkit-scrollbar{display:none;}
@media(max-width:700px){.mob-tabs{display:flex;}}
.mob-tab{flex-shrink:0;padding:11px 14px;font-size:13px;font-weight:500;font-family:inherit;background:none;border:none;border-bottom:2px solid transparent;cursor:pointer;color:var(--ink3);white-space:nowrap;transition:all .18s;}
.mob-tab.on{color:var(--pink-mid);border-bottom-color:var(--pink-mid);font-weight:600;}

.res-body{display:flex;flex:1;min-height:0;background:var(--sidebar);}
.res-sidebar{width:156px;flex-shrink:0;background:var(--sidebar);border-right:1px solid var(--sidebar-border);padding:16px 0;position:sticky;top:40px;height:calc(100vh - 40px);overflow-y:auto;}
@media(max-width:700px){.res-sidebar{display:none;}}
.res-sb-title{font-size:11px;font-weight:700;color:var(--ink3);padding:0 14px 8px;text-transform:uppercase;letter-spacing:.07em;}
.res-sb-item{display:flex;align-items:center;gap:9px;padding:7px 14px;font-size:13px;font-weight:500;color:var(--ink2);cursor:pointer;transition:background .15s;}
.res-sb-item:hover{background:rgba(0,0,0,.04);}
.res-sb-item.on{background:var(--pink-light);color:var(--pink-mid);font-weight:600;}
.res-sb-icon{font-size:15px;width:20px;text-align:center;flex-shrink:0;}
.res-main{flex:1;padding:24px 22px 80px;min-width:0;overflow-y:auto;background:var(--win);}
@media(max-width:600px){.res-main{padding:18px 16px 60px;}}

.sec-head{font-size:24px;font-weight:800;color:var(--ink);letter-spacing:-.03em;margin-bottom:16px;}
@media(max-width:600px){.sec-head{font-size:20px;}}
.sec-eyebrow{font-size:12px;color:var(--ink3);margin-bottom:2px;}

.part-pills{display:flex;flex-wrap:wrap;gap:7px;margin-bottom:16px;}
.part-pill{padding:6px 14px;border-radius:999px;font-size:13px;font-weight:500;font-family:inherit;background:var(--panel);border:1.5px solid var(--sidebar-border);cursor:pointer;color:var(--ink2);transition:all .15s;}
.part-pill.on{background:var(--pink);border-color:var(--pink-mid);color:#fff;}

.card{background:var(--win);border-radius:var(--r);border:1px solid var(--border);padding:16px 18px;margin-bottom:10px;box-shadow:var(--shadow-sm);}
.card-label{font-size:11px;font-weight:700;color:var(--ink3);text-transform:uppercase;letter-spacing:.07em;margin-bottom:12px;}

.sent-list{display:flex;flex-direction:column;}
.sent-row{padding:12px 0;border-bottom:1px solid var(--sidebar-border);display:flex;align-items:flex-start;gap:10px;}
.sent-row:last-child{border-bottom:none;}
.sent-text{flex:1;}
.sent-en{font-size:15px;font-weight:600;color:var(--ink);line-height:1.6;margin-bottom:4px;}
.sent-ko{font-size:14px;color:var(--ink2);line-height:1.6;}

.tts-btn{flex-shrink:0;width:36px;height:36px;border-radius:50%;border:none;background:var(--panel);cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:16px;transition:all .15s;margin-top:2px;}
.tts-btn:hover{background:var(--pink-light);}
.tts-btn.playing{background:var(--pink-mid);animation:ptts .8s ease-in-out infinite;}
@keyframes ptts{0%,100%{transform:scale(1);}50%{transform:scale(1.1);}}

.expr-row{padding:13px 0;border-bottom:1px solid var(--sidebar-border);}
.expr-row:last-child{border-bottom:none;}
.expr-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:4px;}
.expr-top{display:flex;align-items:center;gap:7px;flex-wrap:wrap;}
.expr-word{font-size:15px;font-weight:700;color:var(--ink);}
.expr-mean{font-size:13px;color:var(--ink2);margin-bottom:3px;}
.expr-ex{font-size:13px;color:var(--ink3);font-style:italic;margin-bottom:5px;}
.alt-wrap{display:flex;flex-wrap:wrap;gap:5px;margin-top:5px;align-items:center;}
.alt-label{font-size:11px;font-weight:600;color:var(--ink3);}
.alt-chip{display:inline-flex;align-items:center;gap:4px;padding:3px 9px;background:var(--panel);border:1px solid var(--sidebar-border);border-radius:999px;font-size:12px;color:var(--ink2);cursor:pointer;transition:all .15s;}
.alt-chip:hover{background:var(--pink-light);border-color:var(--pink-mid);color:var(--pink-mid);}
.exam-tags{display:flex;flex-wrap:wrap;gap:4px;margin-top:6px;}
.exam-tag{display:inline-flex;align-items:center;padding:2px 8px;border-radius:4px;font-size:11px;font-weight:700;letter-spacing:.02em;}
.exam-tag-토익{background:#FFF3E0;color:#E65100;}
.exam-tag-토스{background:#E8F5E9;color:#2E7D32;}
.exam-tag-오픽{background:#E3F2FD;color:#1565C0;}
.exam-tag-수능{background:#F3E5F5;color:#6A1B9A;}

.legend-box{display:flex;align-items:center;gap:6px;padding:8px 12px;background:var(--panel);border-radius:8px;margin-bottom:14px;font-size:12px;color:var(--ink3);flex-wrap:wrap;}
.legend-item{display:flex;align-items:center;gap:4px;}

.wb-input{width:100%;padding:9px 12px;background:var(--panel);border:1.5px solid var(--sidebar-border);border-radius:8px;font-size:14px;font-family:inherit;color:var(--ink);outline:none;transition:border-color .2s;margin-bottom:8px;}
.wb-input:focus{border-color:var(--pink-mid);background:var(--win);}
.wb-input::placeholder{color:var(--ink4);}
.wb-correct{border-color:#34C759!important;background:#F0FFF4!important;}
.wb-wrong{border-color:#FF3B30!important;background:#FFF0EF!important;}
.wb-result{font-size:12px;margin-top:4px;font-weight:600;}
.wb-result.ok{color:#34C759;}
.wb-result.no{color:#FF3B30;}
.wb-check-btn{padding:7px 14px;background:var(--pink-mid);color:#fff;border:none;border-radius:7px;font-size:13px;font-family:inherit;cursor:pointer;transition:opacity .15s;}
.wb-check-btn:hover{opacity:.85;}
.wb-rehide{padding:6px 12px;background:transparent;border:1.5px solid var(--sidebar-border);border-radius:7px;font-size:12px;font-family:inherit;cursor:pointer;color:var(--ink3);transition:all .15s;margin-left:8px;}
.wb-rehide:hover{border-color:var(--ink);color:var(--ink);}

.conv-item{padding:10px 13px;background:var(--pink-light);border-radius:8px;border-left:3px solid var(--pink);font-size:14px;color:var(--ink2);line-height:1.7;margin-bottom:7px;}
.conv-item:last-child{margin-bottom:0;}
.sh-item{display:flex;align-items:center;gap:9px;padding:9px 13px;background:var(--blue-light);border-radius:8px;border-left:3px solid var(--blue);margin-bottom:7px;}
.sh-item:last-child{margin-bottom:0;}
.sh-text{font-size:14px;color:var(--ink);line-height:1.6;flex:1;}
.learn-box{padding:12px 14px;background:var(--panel);border-radius:8px;font-size:14px;color:var(--ink2);line-height:1.75;}

.mem-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(155px,1fr));gap:9px;margin-top:4px;}
.mem-card{background:var(--win);border-radius:var(--r);padding:13px 14px;border:1px solid var(--border);box-shadow:var(--shadow-sm);transition:box-shadow .15s,transform .15s;}
.mem-card:hover{box-shadow:0 4px 16px rgba(0,0,0,.1);transform:translateY(-2px);}
.mem-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:4px;}
.mem-expr{font-size:14px;font-weight:700;color:var(--pink-mid);}
.mem-mean{font-size:13px;color:var(--ink2);margin-bottom:6px;}
.mem-alts{display:flex;flex-wrap:wrap;gap:4px;}
.mem-alt{font-size:11px;padding:2px 7px;background:var(--panel);border-radius:999px;color:var(--ink3);}

.day-card{background:var(--win);border:1px solid var(--border);border-radius:var(--r);padding:14px 16px;margin-bottom:9px;box-shadow:var(--shadow-sm);}
.day-hd{font-size:13px;font-weight:700;color:var(--pink-mid);margin-bottom:11px;display:flex;align-items:center;gap:8px;}
.day-hd::after{content:'';flex:1;height:1px;background:var(--border);}
.day-row{display:flex;gap:10px;padding:8px 0;border-bottom:1px solid var(--sidebar-border);font-size:14px;color:var(--ink);align-items:center;line-height:1.6;}
.day-row:last-child{border-bottom:none;padding-bottom:0;}
.day-num{flex-shrink:0;font-size:11px;font-weight:700;color:var(--pink-mid);background:var(--pink-light);border-radius:5px;padding:2px 7px;min-width:24px;text-align:center;}
.day-txt{flex:1;}

.wb-head{font-size:17px;font-weight:700;color:var(--ink);margin:22px 0 10px;letter-spacing:-.02em;}
.wb-head:first-child{margin-top:0;}
.wb-card{background:var(--win);border:1px solid var(--border);border-radius:var(--r);padding:14px 16px;margin-bottom:8px;box-shadow:var(--shadow-sm);}
.wb-q{font-size:14px;color:var(--ink);line-height:1.65;margin-bottom:9px;}
.wb-ans{font-size:13px;font-weight:600;color:var(--pink-mid);padding:8px 12px;background:var(--pink-light);border-radius:7px;}
.btn-rev{padding:7px 13px;background:var(--panel);border:none;border-radius:7px;font-size:13px;font-family:inherit;cursor:pointer;color:var(--ink2);transition:background .15s;}
.btn-rev:hover{background:var(--sidebar-border);}
.mtbl{width:100%;border-collapse:collapse;font-size:14px;}
.mtbl th{text-align:left;padding:8px 12px;background:var(--panel);font-size:11px;font-weight:600;color:var(--ink3);letter-spacing:.05em;text-transform:uppercase;}
.mtbl td{padding:10px 12px;border-bottom:1px solid var(--panel);color:var(--ink);}
.mtbl tr:last-child td{border-bottom:none;}
.btn-tog{display:block;padding:8px 13px;background:var(--panel);border:none;border-radius:7px;font-size:13px;font-family:inherit;cursor:pointer;color:var(--ink2);margin-top:10px;transition:background .15s;}
.btn-tog:hover{background:var(--sidebar-border);}
.q-item{background:var(--win);border:1px solid var(--border);border-radius:var(--r);padding:13px 15px;margin-bottom:8px;display:flex;gap:10px;align-items:flex-start;box-shadow:var(--shadow-sm);}
.q-badge{flex-shrink:0;font-size:11px;font-weight:700;color:var(--pink-mid);background:var(--pink-light);border-radius:5px;padding:3px 8px;margin-top:1px;}
.q-txt{font-size:14px;line-height:1.65;color:var(--ink);}

.tagline-bar{display:flex;align-items:center;gap:8px;margin-bottom:20px;padding:10px 14px;background:var(--pink-light);border-radius:10px;}
.tagline-text{font-size:13px;color:var(--pink-mid);font-weight:600;line-height:1.5;}

.app-footer{text-align:center;padding:16px;font-size:11px;color:var(--ink4);letter-spacing:.02em;border-top:1px solid var(--border);margin-top:auto;}
.app-footer span{margin:0 6px;}
`;

const PRINT_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Pretendard:wght@400;600;700&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  body{font-family:'Pretendard',-apple-system,'Apple SD Gothic Neo',sans-serif;color:#1A1A1A;background:#fff;padding:28px 32px;}
  .doc{max-width:680px;margin:0 auto;}
  .hdr{background:#D4849A;color:#fff;padding:18px 22px;border-radius:10px;margin-bottom:24px;}
  .hdr h1{font-size:20px;font-weight:700;margin-bottom:3px;}
  .hdr p{font-size:13px;opacity:.82;}
  .pt{font-size:16px;font-weight:700;color:#D4849A;border-bottom:2px solid #D4849A;padding-bottom:6px;margin:22px 0 12px;}
  .sec{font-size:10px;font-weight:700;color:#7A7A7A;text-transform:uppercase;letter-spacing:.07em;margin:14px 0 7px;}
  .s{padding:8px 0;border-bottom:1px solid #E0E0E0;}
  .se{font-size:14px;font-weight:600;margin-bottom:3px;}
  .sk{font-size:13px;color:#3C3C3C;}
  table{width:100%;border-collapse:collapse;font-size:13px;margin-bottom:10px;}
  th{background:#D4849A;color:#fff;padding:7px 11px;text-align:left;font-size:11px;font-weight:600;}
  td{padding:8px 11px;border-bottom:1px solid #E0E0E0;}
  .shi{padding:7px 11px;background:#FDF0F3;border-left:3px solid #D4849A;margin-bottom:5px;font-size:13px;border-radius:4px;}
  .lb{padding:10px 13px;background:#F7F7F7;border-radius:7px;font-size:13px;color:#3C3C3C;line-height:1.7;}
  .ph{font-size:13px;font-weight:700;color:#D4849A;margin:11px 0 5px;}
  .wr{padding:7px 0;border-bottom:1px solid #E0E0E0;font-size:13px;}
  .ans{color:#D4849A;font-weight:600;}
  .qr{padding:8px 11px;background:#F7F7F7;border-radius:6px;margin-bottom:5px;font-size:13px;}
  @media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact;}}
`;

const TABS = [
  {id:"sentences",label:"해석",icon:"📄"},
  {id:"expressions",label:"표현",icon:"💡"},
  {id:"memory",label:"암기장",icon:"🧠"},
  {id:"shadowing",label:"쉐도잉",icon:"🎙"},
  {id:"workbook",label:"워크북",icon:"✏️"},
];

const SCRIPT_METHODS = [
  {
    icon:"📺", title:"Downsub",
    desc:"유튜브/넷플릭스 링크 붙여넣으면 자막을 텍스트로 추출해줘요. 무료예요.",
    link:"https://downsub.com", linkText:"downsub.com →"
  },
  {
    icon:"🤖", title:"ChatGPT / Claude",
    desc:"영상 링크나 내용을 AI에 붙여넣고 \"영어 스크립트로 정리해줘\"라고 하면 돼요.",
    link:null, linkText:null,
    subLinks:[
      { label:"ChatGPT 열기 →", url:"https://chat.openai.com" },
      { label:"Claude 열기 →", url:"https://claude.ai" },
    ]
  },
  {
    icon:"📋", title:"유튜브 자막 복사",
    desc:"유튜브 영상 → ··· → 스크립트 열기 → 전체 선택 복사. 자막 있는 영상이면 바로 돼요.",
    link:null, linkText:null
  },
];

// ── localStorage 유틸 ──
const LS_KEY = "s2s_recent";

function loadRecent() {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(LS_KEY) || "[]"); }
  catch { return []; }
}

function saveRecent(titleStr, result) {
  const item = {
    id: Date.now(),
    title: titleStr || result.title || "제목 없음",
    savedAt: new Date().toISOString(),
    result,
  };
  const prev = loadRecent();
  // 같은 제목 있으면 덮어씀, 최대 5개 유지
  const updated = [item, ...prev.filter(p => p.title !== item.title)].slice(0, MAX_RECENT);
  try { localStorage.setItem(LS_KEY, JSON.stringify(updated)); } catch {}
  return updated;
}

function deleteRecent(id) {
  const updated = loadRecent().filter(p => p.id !== id);
  try { localStorage.setItem(LS_KEY, JSON.stringify(updated)); } catch {}
  return updated;
}

function formatDate(iso) {
  const d = new Date(iso);
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  return `${mm}/${dd} ${hh}:${min}`;
}

export default function App() {
  const [screen, setScreen] = useState("input");
  const [inputView, setInputView] = useState("new"); // "new" | "recent"
  const [recentList, setRecentList] = useState([]);
  const [script, setScript] = useState("");
  const [title, setTitle] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("sentences");
  const [partIdx, setPartIdx] = useState(0);
  const [reveals, setReveals] = useState({});
  const [wbInputs, setWbInputs] = useState({});
  const [wbChecked, setWbChecked] = useState({});
  const [showMatch, setShowMatch] = useState(false);
  const [showHelper, setShowHelper] = useState(false);
  const [quoteIdx, setQuoteIdx] = useState(0);
  const { speak, speaking } = useTTS();

  useEffect(() => {
    if (typeof window !== "undefined") {
      if ("serviceWorker" in navigator) navigator.serviceWorker.register("/sw.js").catch(()=>{});
    }
    setQuoteIdx(Math.floor(Math.random() * QUOTES.length));
    setRecentList(loadRecent());
  }, []);

  useEffect(() => {
    if (screen !== "loading") return;
    const t = setInterval(() => setQuoteIdx(i => (i + 1) % QUOTES.length), 4000);
    return () => clearInterval(t);
  }, [screen]);

  const reveal = (k) => setReveals(p => ({...p,[k]:true}));
  const unrevel = (k) => setReveals(p => ({...p,[k]:false}));
  const setWbInput = (k, v) => setWbInputs(p => ({...p,[k]:v}));
  const checkWb = (k, answer) => setWbChecked(p => ({...p,[k]: (wbInputs[k]||"").trim().toLowerCase() === answer.toLowerCase() ? "ok" : "no"}));

  const generate = async () => {
    if (!script.trim()) { setError("영어 스크립트를 먼저 붙여넣어 주세요."); return; }
    setScreen("loading"); setError(""); setReveals({}); setWbInputs({}); setWbChecked({}); setShowMatch(false);
    try {
      const res = await fetch("/api/generate", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({script, title})
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error||"오류"); }
      const data = await res.json();
      // ── 생성 완료 시 자동 저장 ──
      const updated = saveRecent(title, data);
      setRecentList(updated);
      setResult(data); setPartIdx(0); setTab("sentences"); setScreen("result");
    } catch(e) { setError(e.message||"오류가 발생했어요."); setScreen("input"); }
  };

  // 최근 교재 불러오기
  const openRecent = (item) => {
    setResult(item.result);
    setTitle(item.title);
    setPartIdx(0); setTab("sentences");
    setReveals({}); setWbInputs({}); setWbChecked({}); setShowMatch(false);
    setScreen("result");
  };

  // 최근 교재 삭제
  const removeRecent = (e, id) => {
    e.stopPropagation();
    const updated = deleteRecent(id);
    setRecentList(updated);
  };

  const goInput = () => {
    setScreen("input");
    setResult(null);
    setInputView("new");
  };

  const printPDF = () => {
    if (!result) return;
    let h = `<html><head><meta charset="UTF-8"/>
      <link href="https://fonts.googleapis.com/css2?family=Pretendard:wght@400;600;700&display=swap" rel="stylesheet"/>
      <style>${PRINT_CSS}</style></head><body><div class="doc">`;
    h += `<div class="hdr"><h1>Script2Study</h1><p>${result.title||""}</p></div>`;
    (result.parts||[]).forEach(p => {
      h += `<div class="pt">${p.partTitle||`Part ${p.partNumber}`}</div>`;
      h += `<div class="sec">문장별 해석</div>`;
      (p.sentences||[]).forEach(s => { h += `<div class="s"><div class="se">${s.en}</div><div class="sk">${s.ko}</div></div>`; });
      if (p.keyExpressions?.length) {
        h += `<div class="sec">핵심 표현</div><table><thead><tr><th>Expression</th><th>Meaning</th><th>Example</th><th>유사 표현</th></tr></thead><tbody>`;
        p.keyExpressions.forEach(e => {
          h += `<tr><td>${e.star?"⭐ ":""}${e.expression}</td><td>${e.meaning}</td><td>${e.example}</td><td style="color:#7A7A7A;font-size:11px">${(e.alternatives||[]).join(", ")}</td></tr>`;
        });
        h += `</tbody></table>`;
      }
      if (p.shadowingSentences?.length) {
        h += `<div class="sec">쉐도잉 문장</div>`;
        p.shadowingSentences.forEach(s => { h += `<div class="shi">${s}</div>`; });
      }
      if (p.learningPoints) h += `<div class="sec">학습 포인트</div><div class="lb">${p.learningPoints}</div>`;
    });
    if (result.memoryCards?.length) {
      h += `<div class="pt">전체 암기장</div><table><thead><tr><th>Expression</th><th>Meaning</th><th>유사 표현</th></tr></thead><tbody>`;
      result.memoryCards.forEach(m => { h += `<tr><td>${m.expression}</td><td>${m.meaning}</td><td style="color:#7A7A7A;font-size:11px">${(m.alternatives||[]).join(", ")}</td></tr>`; });
      h += `</tbody></table>`;
    }
    if (result.shadowingTraining?.length) {
      h += `<div class="pt">쉐도잉 트레이닝</div>`;
      result.shadowingTraining.forEach(part => {
        h += `<div class="ph">${part.partTitle || `Part ${part.partNumber}`}</div>`;
        (part.sentences||[]).forEach((s,i) => { h += `<div class="wr">${i+1}. ${s}</div>`; });
      });
    }
    if (result.workbook) {
      const wb = result.workbook;
      h += `<div class="pt">워크북</div>`;
      if (wb.fillInBlank?.length) {
        h += `<div class="sec">빈칸 채우기</div>`;
        wb.fillInBlank.forEach((q,i) => { h += `<div class="wr">${i+1}. ${q.question}<br/><span class="ans">정답: ${q.answer}</span></div>`; });
      }
      if (wb.matching?.length) {
        h += `<div class="sec">표현 매칭</div><table><thead><tr><th>Expression</th><th>Meaning</th></tr></thead><tbody>`;
        wb.matching.forEach(m => { h += `<tr><td>${m.expression}</td><td>${m.meaning}</td></tr>`; });
        h += `</tbody></table>`;
      }
      if (wb.translation?.length) {
        h += `<div class="sec">한→영 영작</div>`;
        wb.translation.forEach((t,i) => { h += `<div class="wr">${i+1}. ${t.korean}<br/><span class="ans">→ ${t.english}</span></div>`; });
      }
      if (wb.speakingQuestions?.length) {
        h += `<div class="sec">스스로 말해보기</div>`;
        wb.speakingQuestions.forEach((q,i) => { h += `<div class="qr">Q${i+1}. ${q}</div>`; });
      }
    }
    h += `</div></body></html>`;
    const w = window.open("","_blank");
    w.document.write(h); w.document.close();
    w.onload = () => { w.focus(); w.print(); };
  };

  const TTSBtn = ({text, id}) => (
    <button className={`tts-btn ${speaking===id?"playing":""}`}
      onClick={() => speak(text, id)} title="듣기">
      {speaking===id ? "⏹" : "🔊"}
    </button>
  );

  // ── LOADING
  if (screen === "loading") return (
    <>
      <Head><title>Script2Study</title></Head>
      <style jsx global>{G}</style>
      <div className="load-screen">
        <img src="/parkmyungsoo.png" className="load-pms" alt="박명수" />
        <div className="load-title">교재 만드는 중...</div>
        <div className="load-bar"><div className="load-bar-fill"/></div>
        <div className="load-quote">
          <div className="load-quote-ko">"{QUOTES[quoteIdx].ko}"</div>
          <div className="load-quote-author">— 박명수 어록</div>
        </div>
      </div>
    </>
  );

  // ── RESULT
  if (screen === "result" && result) {
    const parts = result.parts || [];
    const part = parts[partIdx] || {};

    const renderContent = () => {
      if (tab === "sentences") return (
        <>
          <div className="sec-eyebrow">Script2Study</div>
          <div className="sec-head">{result.title}</div>
          {parts.length > 1 && (
            <div className="part-pills">
              {parts.map((p,i) => (
                <button key={i} className={`part-pill ${partIdx===i?"on":""}`} onClick={()=>setPartIdx(i)}>
                  {p.partTitle||`Part ${i+1}`}
                </button>
              ))}
            </div>
          )}
          <div className="card">
            <div className="sent-list">
              {(part.sentences||[]).map((s,i) => (
                <div key={i} className="sent-row">
                  <div className="sent-text">
                    <div className="sent-en">{s.en}</div>
                    <div className="sent-ko">{s.ko}</div>
                  </div>
                  <TTSBtn text={s.en} id={`s-${partIdx}-${i}`} />
                </div>
              ))}
            </div>
          </div>
          {part.shadowingSentences?.length > 0 && (
            <div className="card">
              <div className="card-label">🎙 이 파트 쉐도잉</div>
              {part.shadowingSentences.map((s,i) => (
                <div key={i} className="sh-item">
                  <span className="sh-text">{s}</span>
                  <TTSBtn text={s} id={`ss-${partIdx}-${i}`} />
                </div>
              ))}
            </div>
          )}
          {part.learningPoints && (
            <div className="card">
              <div className="card-label">📌 학습 포인트</div>
              <div className="learn-box">{part.learningPoints}</div>
            </div>
          )}
        </>
      );

      if (tab === "expressions") return (
        <>
          <div className="sec-head">핵심 표현</div>
          {parts.length > 1 && (
            <div className="part-pills">
              {parts.map((p,i) => (
                <button key={i} className={`part-pill ${partIdx===i?"on":""}`} onClick={()=>setPartIdx(i)}>
                  {p.partTitle||`Part ${i+1}`}
                </button>
              ))}
            </div>
          )}
          <div className="legend-box">
            <div className="legend-item">⭐ <span>= AI가 선정한 이 파트 핵심 표현</span></div>
          </div>
          <div className="card">
            {(part.keyExpressions||[]).map((e,i) => (
              <div key={i} className="expr-row">
                <div className="expr-header">
                  <div className="expr-top">
                    <span className="expr-word">{e.expression}</span>
                    {e.star && <span style={{fontSize:16}}>⭐</span>}
                  </div>
                  <TTSBtn text={e.expression} id={`e-${partIdx}-${i}`} />
                </div>
                <div className="expr-mean">{e.meaning}</div>
                <div className="expr-ex">예) {e.example}</div>
                {e.alternatives?.length > 0 && (
                  <div className="alt-wrap">
                    <span className="alt-label">유사표현</span>
                    {e.alternatives.map((a,j) => (
                      <span key={j} className="alt-chip" onClick={()=>speak(a,`a-${i}-${j}`)}>
                        {a} 🔊
                      </span>
                    ))}
                  </div>
                )}
                {e.examTags?.length > 0 && (
                  <div className="exam-tags">
                    {e.examTags.map((tag,j) => (
                      <span key={j} className={`exam-tag exam-tag-${tag}`}>{tag} 빈출</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          {(part.conversationPoints||[]).length > 0 && (
            <div className="card">
              <div className="card-label">💬 회화 포인트</div>
              {part.conversationPoints.map((c,i) => <div key={i} className="conv-item">{c}</div>)}
            </div>
          )}
        </>
      );

      if (tab === "memory") return (
        <>
          <div className="sec-head">전체 암기장</div>
          <p style={{fontSize:13,color:"var(--ink3)",marginBottom:14}}>회화에서 바로 꺼낼 수 있는 표현만 모았어요 📌</p>
          <div className="mem-grid">
            {(result.memoryCards||[]).map((m,i) => (
              <div key={i} className="mem-card">
                <div className="mem-header">
                  <div className="mem-expr">{m.expression}</div>
                  <TTSBtn text={m.expression} id={`m-${i}`} />
                </div>
                <div className="mem-mean">{m.meaning}</div>
                {m.alternatives?.length > 0 && (
                  <div className="mem-alts">
                    {m.alternatives.map((a,j) => <span key={j} className="mem-alt">{a}</span>)}
                  </div>
                )}
                {m.examTags?.length > 0 && (
                  <div className="exam-tags" style={{marginTop:6}}>
                    {m.examTags.map((tag,j) => (
                      <span key={j} className={`exam-tag exam-tag-${tag}`}>{tag} 빈출</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      );

      if (tab === "shadowing") return (
        <>
          <div className="sec-head">쉐도잉 트레이닝</div>
          <p style={{fontSize:13,color:"var(--ink3)",marginBottom:14}}>파트별로 소리 내서 따라 말해보세요 🎙</p>
          {(result.shadowingTraining||[]).map((part,i) => (
            <div key={i} className="day-card">
              <div className="day-hd">{part.partTitle || `Part ${part.partNumber}`}</div>
              {(part.sentences||[]).map((s,j) => (
                <div key={j} className="day-row">
                  <span className="day-num">{j+1}</span>
                  <span className="day-txt">{s}</span>
                  <TTSBtn text={s} id={`d-${i}-${j}`} />
                </div>
              ))}
            </div>
          ))}
        </>
      );

      if (tab === "workbook") return (
        <>
          <div className="sec-head">워크북</div>
          <div className="wb-head">1. 빈칸 채우기</div>
          {(result.workbook?.fillInBlank||[]).map((q,i) => (
            <div key={i} className="wb-card">
              <div className="wb-q">{i+1}. {q.question}</div>
              <input
                className={`wb-input ${wbChecked[`f${i}`]==="ok"?"wb-correct":wbChecked[`f${i}`]==="no"?"wb-wrong":""}`}
                placeholder="여기에 답 입력..."
                value={wbInputs[`f${i}`]||""}
                onChange={e=>setWbInput(`f${i}`,e.target.value)}
                onKeyDown={e=>e.key==="Enter"&&checkWb(`f${i}`,q.answer)}
              />
              <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
                <button className="wb-check-btn" onClick={()=>checkWb(`f${i}`,q.answer)}>확인</button>
                {reveals[`f${i}`]
                  ? <button className="wb-rehide" onClick={()=>unrevel(`f${i}`)}>정답 숨기기</button>
                  : <button className="btn-rev" onClick={()=>reveal(`f${i}`)}>정답 보기</button>}
              </div>
              {wbChecked[`f${i}`] && (
                <div className={`wb-result ${wbChecked[`f${i}`]}`}>
                  {wbChecked[`f${i}`]==="ok" ? "✅ 정답이에요!" : `❌ 오답이에요. 정답: ${q.answer}`}
                </div>
              )}
              {reveals[`f${i}`] && <div className="wb-ans" style={{marginTop:8}}>정답: {q.answer}</div>}
            </div>
          ))}
          <div className="wb-head">2. 표현 매칭</div>
          <div className="wb-card">
            <table className="mtbl">
              <thead><tr><th>표현</th><th>뜻</th></tr></thead>
              <tbody>
                {(result.workbook?.matching||[]).map((m,i) => (
                  <tr key={i}>
                    <td>{m.expression}</td>
                    <td style={{color:showMatch?"inherit":"transparent",background:showMatch?"transparent":"var(--sidebar-border)",borderRadius:4,transition:"all .2s",userSelect:showMatch?"auto":"none"}}>{m.meaning}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button className="btn-tog" onClick={()=>setShowMatch(p=>!p)}>
              {showMatch ? "뜻 숨기기" : "뜻 보기"}
            </button>
          </div>
          <div className="wb-head">3. 한→영 영작</div>
          {(result.workbook?.translation||[]).map((t,i) => (
            <div key={i} className="wb-card">
              <div className="wb-q">{i+1}. {t.korean}</div>
              <input
                className="wb-input"
                placeholder="영어로 입력해보세요..."
                value={wbInputs[`t${i}`]||""}
                onChange={e=>setWbInput(`t${i}`,e.target.value)}
              />
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                {reveals[`t${i}`]
                  ? <button className="wb-rehide" onClick={()=>unrevel(`t${i}`)}>정답 숨기기</button>
                  : <button className="btn-rev" onClick={()=>reveal(`t${i}`)}>정답 보기</button>}
              </div>
              {reveals[`t${i}`] && <div className="wb-ans" style={{marginTop:8}}>{t.english}</div>}
            </div>
          ))}
          <div className="wb-head">4. 스스로 말해보기</div>
          {(result.workbook?.speakingQuestions||[]).map((q,i) => (
            <div key={i} className="q-item">
              <span className="q-badge">Q{i+1}</span>
              <span className="q-txt">{q}</span>
            </div>
          ))}
        </>
      );
    };

    return (
      <>
        <Head><title>{result.title} — S2S</title></Head>
        <style jsx global>{G}</style>
        <div className="result-wrap">
          <div className="result-window">
            <div className="res-titlebar">
              <div className="dot dot-r"/><div className="dot dot-y"/><div className="dot dot-g"/>
              <div className="res-titlebar-name">Script2Study</div>
              <div className="res-header-btns">
                <button className="btn-xs btn-xs-blue" onClick={printPDF}>↓ PDF</button>
                <button className="btn-xs btn-xs-ghost" onClick={goInput}>새 교재</button>
              </div>
            </div>
            <div className="mob-tabs">
              {TABS.map(t => (
                <button key={t.id} className={`mob-tab ${tab===t.id?"on":""}`} onClick={()=>setTab(t.id)}>
                  {t.icon} {t.label}
                </button>
              ))}
            </div>
            <div className="res-body">
              <div className="res-sidebar">
                <div className="res-sb-title">교재</div>
                {TABS.map(item => (
                  <div key={item.id} className={`res-sb-item ${tab===item.id?"on":""}`} onClick={()=>setTab(item.id)}>
                    <span className="res-sb-icon">{item.icon}</span>{item.label}
                  </div>
                ))}
              </div>
              <div className="res-main">{renderContent()}</div>
            </div>
            <div className="app-footer">
              <span>Script2Study {VERSION}</span>·<span>{COPYRIGHT}</span>
            </div>
          </div>
        </div>
      </>
    );
  }

  // ── INPUT: 새 교재 / 최근 교재 뷰 분리
  const renderMainPanel = () => {
    if (inputView === "recent") return (
      <>
        <div className="main-eyebrow">Script2Study</div>
        <div className="main-title">최근 교재</div>
        {recentList.length === 0 ? (
          <div className="recent-empty">
            <div className="recent-empty-icon">📂</div>
            아직 저장된 교재가 없어요.<br/>
            교재를 생성하면 여기에 자동으로 저장돼요.
          </div>
        ) : (
          recentList.map(item => (
            <div key={item.id} className="recent-card" onClick={()=>openRecent(item)}>
              <div className="recent-card-icon">📄</div>
              <div className="recent-card-body">
                <div className="recent-card-title">{item.title}</div>
                <div className="recent-card-meta">{formatDate(item.savedAt)} 저장</div>
              </div>
              <button className="recent-card-del" onClick={e=>removeRecent(e, item.id)} title="삭제">🗑</button>
            </div>
          ))
        )}
      </>
    );

    return (
      <>
        <div className="main-eyebrow">Script2Study</div>
        <div className="main-title">새 교재 만들기</div>
        <div className="tagline-bar">
          <span style={{fontSize:18}}>📖</span>
          <span className="tagline-text">좋아하는 영어 콘텐츠 스크립트로<br/>나만의 학습 교재를 자동으로 만들어드려요</span>
        </div>
        <div className="field">
          <label className="lbl">콘텐츠 제목 (선택)</label>
          <input className="inp" type="text"
            placeholder="예: Hey Tablo EP.1 — MBTI는 옛말?"
            value={title} onChange={e=>setTitle(e.target.value)}/>
        </div>
        <div className="field">
          <label className="lbl">영어 스크립트 * (최대 10,000자)</label>
          <textarea className="inp ta"
            placeholder={"여기에 영어 원문을 붙여넣으세요\n팟캐스트, 유튜브, 드라마 대본, 인터뷰 등 모두 OK"}
            value={script} onChange={e=>setScript(e.target.value)}/>
          <div className="cnt">{script.length.toLocaleString()} / 10,000자</div>
        </div>
        <button className="btn-gen" onClick={generate} disabled={!script.trim()}>
          교재 자동 생성 →
        </button>
        {error && <div className="err">{error}</div>}
        <div className="no-script-box">
          <div className="no-script-title">
            🤔 잠깐! 스크립트가 없으신가요?
            <button
              onClick={()=>setShowHelper(p=>!p)}
              style={{marginLeft:"auto",fontSize:12,color:"var(--pink-mid)",background:"none",border:"none",cursor:"pointer",fontFamily:"inherit",fontWeight:600}}>
              {showHelper ? "접기 ▲" : "방법 보기 ▼"}
            </button>
          </div>
          {showHelper && SCRIPT_METHODS.map((m, i) => (
            <div key={i} className="script-method"
              onClick={()=> m.link && window.open(m.link,"_blank")}
              style={{cursor: m.link ? "pointer" : "default"}}>
              <div className="sm-icon">{m.icon}</div>
              <div className="sm-body">
                <div className="sm-title">{m.title}</div>
                <div className="sm-desc">{m.desc}</div>
                {m.link && <div className="sm-link">{m.linkText}</div>}
                {m.subLinks && (
                  <div style={{display:"flex",gap:10,marginTop:6,flexWrap:"wrap"}}>
                    {m.subLinks.map((sl,j) => (
                      <span key={j}
                        onClick={e=>{e.stopPropagation();window.open(sl.url,"_blank");}}
                        className="sm-link" style={{cursor:"pointer"}}>
                        {sl.label}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          {!showHelper && (
            <div style={{fontSize:13,color:"var(--ink3)"}}>
              유튜브 자막 추출, AI 변환 등 3가지 방법을 알려드려요 👆
            </div>
          )}
        </div>
      </>
    );
  };

  return (
    <>
      <Head><title>Script2Study</title></Head>
      <style jsx global>{G}</style>
      <div className="input-screen">
        <div className="finder-window">
          <div className="titlebar">
            <div className="dot dot-r"/><div className="dot dot-y"/><div className="dot dot-g"/>
            <div className="titlebar-name">Script2Study</div>
          </div>
          <div className="finder-body">
            <div className="sidebar">
              <div className="sb-section">
                <div className="sb-label">메뉴</div>
                <div className={`sb-item ${inputView==="new"?"active":""}`} onClick={()=>setInputView("new")}>
                  <span className="sb-icon">📝</span>새 교재
                </div>
                <div className={`sb-item ${inputView==="recent"?"active":""}`} onClick={()=>setInputView("recent")}>
                  <span className="sb-icon">📂</span>최근 교재
                  {recentList.length > 0 && (
                    <span className="sb-badge">{recentList.length}</span>
                  )}
                </div>
              </div>
            </div>
            <div className="main-panel">
              {/* 모바일 전용 뷰 토글 */}
              <div className="mob-view-bar">
                <button className={`mob-view-btn ${inputView==="new"?"active":""}`} onClick={()=>setInputView("new")}>
                  📝 새 교재
                </button>
                <button className={`mob-view-btn ${inputView==="recent"?"active":""}`} onClick={()=>setInputView("recent")}>
                  📂 최근 {recentList.length > 0 ? `(${recentList.length})` : ""}
                </button>
              </div>
              {renderMainPanel()}
            </div>
          </div>
          <div className="app-footer">
            <span>Script2Study {VERSION}</span>·<span>{COPYRIGHT}</span>
          </div>
        </div>
      </div>
    </>
  );
}
