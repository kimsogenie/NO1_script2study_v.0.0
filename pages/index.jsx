import { useState, useEffect, useCallback } from "react";
import Head from "next/head";

function useTTS() {
  const [speaking, setSpeaking] = useState(null);
  const speak = useCallback((text, id) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    if (speaking === id) { setSpeaking(null); return; }
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "en-US"; u.rate = 0.9;
    const voices = window.speechSynthesis.getVoices();
    const en = voices.find(v => v.lang.startsWith("en") && v.name.includes("Google"))
      || voices.find(v => v.lang.startsWith("en-US"))
      || voices.find(v => v.lang.startsWith("en"));
    if (en) u.voice = en;
    u.onstart = () => setSpeaking(id);
    u.onend = () => setSpeaking(null);
    u.onerror = () => setSpeaking(null);
    window.speechSynthesis.speak(u);
  }, [speaking]);
  const stop = useCallback(() => { window.speechSynthesis?.cancel(); setSpeaking(null); }, []);
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

/* ── INPUT SCREEN ── */
.input-screen{
  min-height:100vh;display:flex;align-items:flex-start;
  justify-content:center;padding:32px 20px;background:var(--bg);
}
@media(max-width:600px){.input-screen{padding:16px 12px;align-items:flex-start;}}

.finder-window{
  width:100%;max-width:640px;background:var(--win);
  border-radius:16px;box-shadow:var(--shadow);overflow:hidden;
  border:1px solid rgba(255,255,255,0.9);
}
@media(max-width:600px){.finder-window{border-radius:14px;}}

/* Titlebar */
.titlebar{
  height:40px;background:var(--sidebar);border-bottom:1px solid var(--sidebar-border);
  display:flex;align-items:center;padding:0 14px;gap:7px;
}
.dot{width:12px;height:12px;border-radius:50%;flex-shrink:0;}
.dot-r{background:#FF5F57;}.dot-y{background:#FEBC2E;}.dot-g{background:#28C840;}
.titlebar-name{flex:1;text-align:center;font-size:13px;font-weight:500;color:var(--ink3);margin-left:-36px;}

/* Desktop: sidebar + main */
.finder-body{display:flex;}

.sidebar{
  width:160px;flex-shrink:0;background:var(--sidebar);
  border-right:1px solid var(--sidebar-border);padding:16px 0;
}
/* 모바일에서 사이드바 완전히 숨김 */
@media(max-width:600px){.sidebar{display:none;}}

.sb-section{margin-bottom:18px;}
.sb-label{font-size:11px;font-weight:700;color:var(--ink3);padding:0 14px 6px;text-transform:uppercase;letter-spacing:.07em;}
.sb-item{display:flex;align-items:center;gap:9px;padding:6px 14px;font-size:14px;font-weight:500;color:var(--ink2);cursor:pointer;transition:background .15s;}
.sb-item:hover{background:rgba(0,0,0,.04);}
.sb-item.active{background:var(--blue-light);color:var(--blue);font-weight:600;}
.sb-icon{font-size:15px;width:20px;text-align:center;flex-shrink:0;}

/* Main panel */
.main-panel{flex:1;padding:28px 28px 32px;min-width:0;}
@media(max-width:600px){.main-panel{padding:22px 18px 28px;}}

.main-eyebrow{font-size:13px;color:var(--ink3);margin-bottom:2px;}
.main-title{font-size:28px;font-weight:800;color:var(--ink);letter-spacing:-.03em;margin-bottom:22px;}
@media(max-width:600px){.main-title{font-size:24px;}}

.field{margin-bottom:14px;}
.lbl{display:block;font-size:12px;font-weight:600;color:var(--ink3);margin-bottom:6px;}
.inp{
  width:100%;padding:11px 13px;background:var(--win);border:1.5px solid var(--border);
  border-radius:8px;font-size:15px;font-family:inherit;color:var(--ink);outline:none;
  transition:border-color .2s,box-shadow .2s;
}
.inp:focus{border-color:var(--blue);box-shadow:0 0 0 3px var(--blue-light);}
.inp::placeholder{color:var(--ink4);}
.ta{height:160px;resize:vertical;line-height:1.6;}
@media(max-width:600px){.ta{height:140px;}}
.cnt{font-size:12px;color:var(--ink4);text-align:right;margin-top:4px;}

.btn-gen{
  width:100%;padding:14px;background:var(--blue);color:#fff;border:none;
  border-radius:8px;font-size:15px;font-weight:700;font-family:inherit;
  cursor:pointer;letter-spacing:-.01em;transition:opacity .15s,transform .1s;
  margin-top:4px;box-shadow:0 2px 8px rgba(74,144,217,.35);
}
.btn-gen:hover{opacity:.88;transform:translateY(-1px);}
.btn-gen:active{transform:translateY(0);}
.btn-gen:disabled{background:var(--ink4);box-shadow:none;cursor:not-allowed;transform:none;}

.err{font-size:13px;color:#E05555;text-align:center;margin-top:10px;}

/* 스크립트 없나요 박스 */
.no-script-box{
  margin-top:20px;padding:18px;background:var(--panel);
  border-radius:12px;border:1px solid var(--sidebar-border);
}
.no-script-title{
  font-size:14px;font-weight:700;color:var(--ink);margin-bottom:12px;
  display:flex;align-items:center;gap:6px;
}
.script-method{
  display:flex;align-items:flex-start;gap:10px;
  padding:10px 12px;background:var(--win);border-radius:8px;
  margin-bottom:8px;border:1px solid var(--border);
  text-decoration:none;cursor:pointer;transition:box-shadow .15s;
}
.script-method:hover{box-shadow:0 2px 8px rgba(0,0,0,.08);}
.script-method:last-child{margin-bottom:0;}
.sm-icon{font-size:20px;flex-shrink:0;margin-top:1px;}
.sm-body{}
.sm-title{font-size:13px;font-weight:700;color:var(--ink);margin-bottom:2px;}
.sm-desc{font-size:12px;color:var(--ink3);line-height:1.5;}
.sm-link{font-size:11px;color:var(--blue);margin-top:3px;font-weight:600;}

/* ── LOADING ── */
.load-screen{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:18px;background:var(--bg);}
.load-folder{font-size:56px;animation:bob 1.4s ease-in-out infinite;}
@keyframes bob{0%,100%{transform:translateY(0);}50%{transform:translateY(-8px);}}
.load-title{font-size:20px;font-weight:700;color:var(--ink);letter-spacing:-.02em;}
.load-sub{font-size:14px;color:var(--ink3);}
.load-bar{width:160px;height:3px;background:var(--sidebar-border);border-radius:99px;overflow:hidden;}
.load-bar-fill{height:100%;background:var(--blue);border-radius:99px;animation:fill 1.5s ease-in-out infinite;}
@keyframes fill{0%{width:0%;margin-left:0;}60%{width:70%;margin-left:0;}100%{width:0%;margin-left:100%;}}

/* ── RESULT ── */
.result-wrap{min-height:100vh;background:var(--bg);}
.result-window{
  max-width:900px;margin:0 auto;background:var(--win);
  min-height:100vh;box-shadow:0 0 60px rgba(0,0,0,.12);display:flex;flex-direction:column;
}
@media(min-width:900px){
  .result-window{min-height:auto;margin:32px auto;border-radius:16px;overflow:hidden;min-height:calc(100vh - 64px);}
}

.res-titlebar{
  height:40px;background:var(--sidebar);border-bottom:1px solid var(--sidebar-border);
  display:flex;align-items:center;padding:0 14px;gap:7px;
  position:sticky;top:0;z-index:30;flex-shrink:0;
}
.res-titlebar-name{flex:1;text-align:center;font-size:13px;font-weight:500;color:var(--ink3);margin-left:-36px;}
.res-header-btns{display:flex;gap:6px;position:absolute;right:14px;}
.btn-xs{padding:5px 12px;border-radius:6px;font-size:12px;font-weight:600;font-family:inherit;cursor:pointer;transition:opacity .15s;border:none;white-space:nowrap;}
.btn-xs-blue{background:var(--blue);color:#fff;}
.btn-xs-blue:hover{opacity:.85;}
.btn-xs-ghost{background:rgba(0,0,0,.07);color:var(--ink2);}
.btn-xs-ghost:hover{background:rgba(0,0,0,.11);}

/* 모바일 탭바 */
.mob-tabs{
  display:none;background:var(--sidebar);
  border-bottom:1px solid var(--sidebar-border);
  overflow-x:auto;-webkit-overflow-scrolling:touch;scrollbar-width:none;
  flex-shrink:0;
}
.mob-tabs::-webkit-scrollbar{display:none;}
@media(max-width:700px){.mob-tabs{display:flex;}}
.mob-tab{
  flex-shrink:0;padding:11px 14px;font-size:13px;font-weight:500;
  font-family:inherit;background:none;border:none;
  border-bottom:2px solid transparent;cursor:pointer;
  color:var(--ink3);white-space:nowrap;transition:all .18s;
}
.mob-tab.on{color:var(--blue);border-bottom-color:var(--blue);font-weight:600;}

.res-body{display:flex;flex:1;min-height:0;}

/* 데스크탑 사이드바 */
.res-sidebar{
  width:156px;flex-shrink:0;background:var(--sidebar);
  border-right:1px solid var(--sidebar-border);
  padding:16px 0;position:sticky;top:40px;
  height:calc(100vh - 40px);overflow-y:auto;
}
@media(max-width:700px){.res-sidebar{display:none;}}

.res-sb-title{font-size:11px;font-weight:700;color:var(--ink3);padding:0 14px 8px;text-transform:uppercase;letter-spacing:.07em;}
.res-sb-item{display:flex;align-items:center;gap:9px;padding:7px 14px;font-size:13px;font-weight:500;color:var(--ink2);cursor:pointer;transition:background .15s;}
.res-sb-item:hover{background:rgba(0,0,0,.04);}
.res-sb-item.on{background:var(--blue-light);color:var(--blue);font-weight:600;}
.res-sb-icon{font-size:15px;width:20px;text-align:center;flex-shrink:0;}

.res-main{flex:1;padding:24px 22px 80px;min-width:0;overflow-y:auto;}
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
.sent-row{padding:12px 0;border-bottom:1px solid var(--panel);display:flex;align-items:flex-start;gap:10px;}
.sent-row:last-child{border-bottom:none;}
.sent-text{flex:1;}
.sent-en{font-size:15px;font-weight:600;color:var(--ink);line-height:1.6;margin-bottom:4px;}
.sent-ko{font-size:14px;color:var(--ink2);line-height:1.6;}

.tts-btn{
  flex-shrink:0;width:30px;height:30px;border-radius:50%;border:none;
  background:var(--panel);cursor:pointer;display:flex;align-items:center;
  justify-content:center;font-size:14px;transition:all .15s;margin-top:2px;
}
.tts-btn:hover{background:var(--blue-light);}
.tts-btn.playing{background:var(--blue);animation:ptts .8s ease-in-out infinite;}
@keyframes ptts{0%,100%{transform:scale(1);}50%{transform:scale(1.1);}}

.expr-row{padding:13px 0;border-bottom:1px solid var(--panel);}
.expr-row:last-child{border-bottom:none;}
.expr-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:4px;}
.expr-top{display:flex;align-items:center;gap:7px;flex-wrap:wrap;}
.expr-word{font-size:15px;font-weight:700;color:var(--ink);}
.pick-tag{background:var(--pink);color:#fff;font-size:10px;font-weight:700;padding:2px 7px;border-radius:4px;}
.expr-mean{font-size:13px;color:var(--ink2);margin-bottom:3px;}
.expr-ex{font-size:13px;color:var(--ink3);font-style:italic;margin-bottom:5px;}
.alt-wrap{display:flex;flex-wrap:wrap;gap:5px;margin-top:5px;align-items:center;}
.alt-label{font-size:11px;font-weight:600;color:var(--ink3);}
.alt-chip{display:inline-flex;align-items:center;gap:4px;padding:3px 9px;background:var(--panel);border:1px solid var(--sidebar-border);border-radius:999px;font-size:12px;color:var(--ink2);cursor:pointer;transition:all .15s;}
.alt-chip:hover{background:var(--blue-light);border-color:var(--blue);color:var(--blue);}
.exam-tags{display:flex;flex-wrap:wrap;gap:4px;margin-top:6px;}
.exam-tag{display:inline-flex;align-items:center;padding:2px 8px;border-radius:4px;font-size:11px;font-weight:700;letter-spacing:.02em;}
.exam-tag-토익{background:#FFF3E0;color:#E65100;}
.exam-tag-토스{background:#E8F5E9;color:#2E7D32;}
.exam-tag-오픽{background:#E3F2FD;color:#1565C0;}
.exam-tag-수능{background:#F3E5F5;color:#6A1B9A;}

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
.day-hd{font-size:13px;font-weight:700;color:var(--blue);margin-bottom:11px;display:flex;align-items:center;gap:8px;}
.day-hd::after{content:'';flex:1;height:1px;background:var(--border);}
.day-row{display:flex;gap:10px;padding:8px 0;border-bottom:1px solid var(--panel);font-size:14px;color:var(--ink);align-items:center;line-height:1.6;}
.day-row:last-child{border-bottom:none;}
.day-num{flex-shrink:0;font-size:11px;font-weight:700;color:var(--blue);background:var(--blue-light);border-radius:5px;padding:2px 7px;min-width:24px;text-align:center;}
.day-txt{flex:1;}

.wb-head{font-size:17px;font-weight:700;color:var(--ink);margin:22px 0 10px;letter-spacing:-.02em;}
.wb-head:first-child{margin-top:0;}
.wb-card{background:var(--win);border:1px solid var(--border);border-radius:var(--r);padding:14px 16px;margin-bottom:8px;box-shadow:var(--shadow-sm);}
.wb-q{font-size:14px;color:var(--ink);line-height:1.65;margin-bottom:9px;}
.wb-ans{font-size:13px;font-weight:600;color:var(--blue);padding:8px 12px;background:var(--blue-light);border-radius:7px;}
.btn-rev{padding:7px 13px;background:var(--panel);border:none;border-radius:7px;font-size:13px;font-family:inherit;cursor:pointer;color:var(--ink2);transition:background .15s;}
.btn-rev:hover{background:var(--sidebar-border);}
.mtbl{width:100%;border-collapse:collapse;font-size:14px;}
.mtbl th{text-align:left;padding:8px 12px;background:var(--panel);font-size:11px;font-weight:600;color:var(--ink3);letter-spacing:.05em;text-transform:uppercase;}
.mtbl td{padding:10px 12px;border-bottom:1px solid var(--panel);color:var(--ink);}
.mtbl tr:last-child td{border-bottom:none;}
.hidden-m{color:transparent;background:var(--sidebar-border);border-radius:4px;user-select:none;}
.btn-tog{display:block;padding:8px 13px;background:var(--panel);border:none;border-radius:7px;font-size:13px;font-family:inherit;cursor:pointer;color:var(--ink2);margin-top:10px;transition:background .15s;}
.btn-tog:hover{background:var(--sidebar-border);}
.q-item{background:var(--win);border:1px solid var(--border);border-radius:var(--r);padding:13px 15px;margin-bottom:8px;display:flex;gap:10px;align-items:flex-start;box-shadow:var(--shadow-sm);}
.q-badge{flex-shrink:0;font-size:11px;font-weight:700;color:var(--pink-mid);background:var(--pink-light);border-radius:5px;padding:3px 8px;margin-top:1px;}
.q-txt{font-size:14px;line-height:1.65;color:var(--ink);}
`;

const PRINT_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Pretendard:wght@400;600;700&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  body{font-family:'Pretendard',-apple-system,'Apple SD Gothic Neo',sans-serif;color:#1A1A1A;background:#fff;padding:28px 32px;}
  .doc{max-width:680px;margin:0 auto;}
  .hdr{background:#4A90D9;color:#fff;padding:18px 22px;border-radius:10px;margin-bottom:24px;}
  .hdr h1{font-size:20px;font-weight:700;margin-bottom:3px;}
  .hdr p{font-size:13px;opacity:.82;}
  .pt{font-size:16px;font-weight:700;color:#4A90D9;border-bottom:2px solid #4A90D9;padding-bottom:6px;margin:22px 0 12px;}
  .sec{font-size:10px;font-weight:700;color:#7A7A7A;text-transform:uppercase;letter-spacing:.07em;margin:14px 0 7px;}
  .s{padding:8px 0;border-bottom:1px solid #F0F0F0;}
  .se{font-size:14px;font-weight:600;margin-bottom:3px;}
  .sk{font-size:13px;color:#3C3C3C;}
  table{width:100%;border-collapse:collapse;font-size:13px;margin-bottom:10px;}
  th{background:#4A90D9;color:#fff;padding:7px 11px;text-align:left;font-size:11px;font-weight:600;}
  td{padding:8px 11px;border-bottom:1px solid #F0F0F0;}
  .shi{padding:7px 11px;background:#EEF5FC;border-left:3px solid #4A90D9;margin-bottom:5px;font-size:13px;border-radius:4px;}
  .lb{padding:10px 13px;background:#F7F7F7;border-radius:7px;font-size:13px;color:#3C3C3C;line-height:1.7;}
  .dh{font-size:13px;font-weight:700;color:#4A90D9;margin:11px 0 5px;}
  .wr{padding:7px 0;border-bottom:1px solid #F0F0F0;font-size:13px;}
  .ans{color:#4A90D9;font-weight:600;}
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
    icon:"📺",
    title:"Downsub",
    desc:"유튜브/넷플릭스 링크 붙여넣으면 자막을 텍스트로 추출해줘요. 무료예요.",
    link:"https://downsub.com",
    linkText:"downsub.com →"
  },
  {
    icon:"🤖",
    title:"ChatGPT / Claude",
    desc:"영상 링크나 내용을 AI에 붙여넣고 \"영어 스크립트로 정리해줘\"라고 하면 돼요.",
    link:null,
    linkText:null
  },
  {
    icon:"📋",
    title:"유튜브 자막 복사",
    desc:"유튜브 영상 → ··· → 스크립트 열기 → 전체 선택 복사. 자막 있는 영상이면 바로 돼요.",
    link:null,
    linkText:null
  },
];

export default function App() {
  const [screen, setScreen] = useState("input");
  const [script, setScript] = useState("");
  const [title, setTitle] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("sentences");
  const [partIdx, setPartIdx] = useState(0);
  const [reveals, setReveals] = useState({});
  const [showMatch, setShowMatch] = useState(false);
  const [showHelper, setShowHelper] = useState(false);
  const { speak, speaking } = useTTS();

  useEffect(() => {
    if (typeof window !== "undefined") {
      if ("serviceWorker" in navigator) navigator.serviceWorker.register("/sw.js").catch(()=>{});
      window.speechSynthesis?.getVoices();
    }
  }, []);

  const reveal = (k) => setReveals(p => ({...p,[k]:true}));

  const generate = async () => {
    if (!script.trim()) { setError("영어 스크립트를 먼저 붙여넣어 주세요."); return; }
    setScreen("loading"); setError(""); setReveals({}); setShowMatch(false);
    try {
      const res = await fetch("/api/generate", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({script, title})
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error||"오류"); }
      setResult(await res.json()); setPartIdx(0); setTab("sentences"); setScreen("result");
    } catch(e) { setError(e.message||"오류가 발생했어요."); setScreen("input"); }
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
      result.shadowingTraining.forEach(d => {
        h += `<div class="dh">Day ${d.day}</div>`;
        (d.sentences||[]).forEach((s,i) => { h += `<div class="wr">${i+1}. ${s}</div>`; });
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
        <div className="load-folder">📂</div>
        <div className="load-title">교재 만드는 중...</div>
        <div className="load-sub">잠깐만 기다려 주세요</div>
        <div className="load-bar"><div className="load-bar-fill"/></div>
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
          <div className="card">
            {(part.keyExpressions||[]).map((e,i) => (
              <div key={i} className="expr-row">
                <div className="expr-header">
                  <div className="expr-top">
                    <span className="expr-word">{e.expression}</span>
                    {e.star && <span className="pick-tag">PICK</span>}
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
          <p style={{fontSize:13,color:"var(--ink3)",marginBottom:14}}>Day 1부터 소리 내서 따라 말해보세요 🎙</p>
          {(result.shadowingTraining||[]).map((day,i) => (
            <div key={i} className="day-card">
              <div className="day-hd">Day {day.day}</div>
              {(day.sentences||[]).map((s,j) => (
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
              {reveals[`f${i}`] ? <div className="wb-ans">정답: {q.answer}</div>
                : <button className="btn-rev" onClick={()=>reveal(`f${i}`)}>정답 보기</button>}
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
                    <td className={showMatch?"":"hidden-m"}>{m.meaning}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button className="btn-tog" onClick={()=>setShowMatch(p=>!p)}>
              {showMatch?"뜻 숨기기":"뜻 보기"}
            </button>
          </div>
          <div className="wb-head">3. 한→영 영작</div>
          {(result.workbook?.translation||[]).map((t,i) => (
            <div key={i} className="wb-card">
              <div className="wb-q">{i+1}. {t.korean}</div>
              {reveals[`t${i}`] ? <div className="wb-ans">{t.english}</div>
                : <button className="btn-rev" onClick={()=>reveal(`t${i}`)}>정답 보기</button>}
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
                <button className="btn-xs btn-xs-ghost" onClick={()=>{setScreen("input");setResult(null);}}>새 교재</button>
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
          </div>
        </div>
      </>
    );
  }

  // ── INPUT
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
            {/* 데스크탑 사이드바 */}
            <div className="sidebar">
              <div className="sb-section">
                <div className="sb-label">메뉴</div>
                <div className="sb-item active"><span className="sb-icon">📝</span>새 교재</div>
                <div className="sb-item"><span className="sb-icon">📂</span>최근 교재</div>
              </div>
              <div className="sb-section">
                <div className="sb-label">교재 유형</div>
                <div className="sb-item"><span className="sb-icon">🎙</span>팟캐스트</div>
                <div className="sb-item"><span className="sb-icon">📺</span>유튜브</div>
                <div className="sb-item"><span className="sb-icon">🎬</span>드라마</div>
                <div className="sb-item"><span className="sb-icon">📰</span>인터뷰</div>
              </div>
            </div>

            {/* 메인 */}
            <div className="main-panel">
              <div className="main-eyebrow">Script2Study</div>
              <div className="main-title">새 교재 만들기</div>

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

              {/* 스크립트 없나요? 섹션 */}
              <div className="no-script-box">
                <div className="no-script-title">
                  🤔 잠깐! 스크립트가 없으신가요?
                  <button
                    onClick={()=>setShowHelper(p=>!p)}
                    style={{marginLeft:"auto",fontSize:12,color:"var(--blue)",background:"none",border:"none",cursor:"pointer",fontFamily:"inherit",fontWeight:600}}>
                    {showHelper ? "접기 ▲" : "방법 보기 ▼"}
                  </button>
                </div>

                {showHelper && SCRIPT_METHODS.map((m, i) => (
                  <div key={i} className="script-method"
                    onClick={()=> m.link && window.open(m.link,"_blank")}>
                    <div className="sm-icon">{m.icon}</div>
                    <div className="sm-body">
                      <div className="sm-title">{m.title}</div>
                      <div className="sm-desc">{m.desc}</div>
                      {m.link && <div className="sm-link">{m.linkText}</div>}
                    </div>
                  </div>
                ))}

                {!showHelper && (
                  <div style={{fontSize:13,color:"var(--ink3)"}}>
                    유튜브 자막 추출, AI 변환 등 3가지 방법을 알려드려요 👆
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
