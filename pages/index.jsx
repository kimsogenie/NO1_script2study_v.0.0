import { useState, useEffect } from "react";
import Head from "next/head";

const G = `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Noto+Sans+KR:wght@400;500;600;700&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
:root{
  --bg:#F7F5F0;
  --white:#FFFFFF;
  --ink:#1A1A1A;
  --ink2:#4A4A4A;
  --ink3:#888;
  --border:#E0DDD6;
  --green:#059652;
  --green-light:#E8F7EE;
  --yellow:#F5C842;
  --yellow-light:#FFFBEA;
  --red:#E8453C;
  --radius:14px;
  --shadow:0 2px 12px rgba(0,0,0,.07);
}
body{font-family:'Noto Sans KR',system-ui,sans-serif;background:var(--bg);color:var(--ink);min-height:100vh;}

/* ── INPUT SCREEN ── */
.input-bg{
  min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px;
  background:var(--bg);
}
.input-wrap{max-width:560px;width:100%;}

.brand{margin-bottom:36px;}
.brand-name{
  font-family:'Bebas Neue',sans-serif;font-size:52px;letter-spacing:.04em;
  color:var(--ink);line-height:1;margin-bottom:4px;
}
.brand-name span{color:var(--green);}
.brand-tag{
  display:inline-block;background:var(--yellow);color:var(--ink);
  font-size:11px;font-weight:700;padding:3px 10px;border-radius:4px;letter-spacing:.04em;
}

.field{margin-bottom:16px;}
.lbl{display:block;font-size:11px;font-weight:700;color:var(--ink3);letter-spacing:.08em;
  text-transform:uppercase;margin-bottom:7px;}
.inp{
  width:100%;padding:13px 16px;background:var(--white);border:2px solid var(--border);
  border-radius:var(--radius);font-size:14px;font-family:inherit;color:var(--ink);
  outline:none;transition:border-color .2s;
}
.inp:focus{border-color:var(--green);}
.inp::placeholder{color:#C0BDB5;}
.ta{height:200px;resize:vertical;line-height:1.65;}
.cnt{font-size:11px;color:var(--ink3);text-align:right;margin-top:5px;}

.btn-gen{
  width:100%;padding:16px;background:var(--ink);color:#fff;border:none;
  border-radius:var(--radius);font-size:15px;font-weight:700;font-family:inherit;
  cursor:pointer;transition:background .2s,transform .1s;letter-spacing:.01em;margin-top:4px;
}
.btn-gen:hover{background:#333;transform:translateY(-1px);}
.btn-gen:disabled{background:#C0BDB5;cursor:not-allowed;transform:none;}

.err{font-size:13px;color:var(--red);text-align:center;margin-top:10px;}
.tip{
  margin-top:20px;padding:14px 16px;background:var(--green-light);
  border-radius:var(--radius);border-left:3px solid var(--green);
  font-size:13px;color:var(--ink2);line-height:1.7;
}

/* ── LOADING ── */
.load-screen{
  min-height:100vh;display:flex;flex-direction:column;
  align-items:center;justify-content:center;gap:20px;background:var(--bg);
}
.spinner{
  width:44px;height:44px;border:3px solid var(--border);
  border-top-color:var(--green);border-radius:50%;animation:spin .7s linear infinite;
}
@keyframes spin{to{transform:rotate(360deg);}}
.load-title{font-family:'Bebas Neue',sans-serif;font-size:28px;letter-spacing:.04em;color:var(--ink);}
.load-sub{font-size:14px;color:var(--ink3);}

/* ── RESULT: HEADER ── */
.rh{
  background:var(--white);border-bottom:2px solid var(--border);
  padding:0 24px;display:flex;align-items:center;
  justify-content:space-between;position:sticky;top:0;z-index:20;height:58px;gap:12px;
}
.hl{min-width:0;}
.hname{font-family:'Bebas Neue',sans-serif;font-size:22px;letter-spacing:.04em;color:var(--ink);line-height:1;}
.hname span{color:var(--green);}
.htitle{font-size:12px;color:var(--ink3);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:260px;}
.hbtns{display:flex;gap:8px;flex-shrink:0;}

.btn-pdf{
  padding:8px 16px;background:var(--green);color:#fff;border:none;
  border-radius:8px;font-size:12px;font-weight:700;font-family:inherit;
  cursor:pointer;transition:background .2s;white-space:nowrap;
}
.btn-pdf:hover{background:#047a42;}
.btn-pdf:disabled{background:#A7D9BC;cursor:not-allowed;}
.btn-back{
  padding:8px 14px;background:transparent;border:2px solid var(--border);
  border-radius:8px;font-size:12px;font-family:inherit;cursor:pointer;
  color:var(--ink2);white-space:nowrap;transition:all .18s;
}
.btn-back:hover{border-color:var(--ink);color:var(--ink);}

/* ── TABS ── */
.tb{
  background:var(--white);padding:0 20px;display:flex;
  border-bottom:2px solid var(--border);overflow-x:auto;
  -webkit-overflow-scrolling:touch;scrollbar-width:none;
}
.tb::-webkit-scrollbar{display:none;}
.tbtn{
  flex-shrink:0;padding:14px 15px;font-size:13px;font-weight:600;font-family:inherit;
  background:none;border:none;border-bottom:3px solid transparent;
  cursor:pointer;color:var(--ink3);white-space:nowrap;transition:all .18s;margin-bottom:-2px;
}
.tbtn.on{color:var(--green);border-bottom-color:var(--green);}
.tbtn:hover:not(.on){color:var(--ink);}

/* ── CONTENT ── */
.ca{max-width:780px;margin:0 auto;padding:28px 20px 80px;}

/* Part pills */
.ps{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:22px;}
.pp{
  padding:7px 16px;border-radius:999px;font-size:12px;font-weight:700;font-family:inherit;
  background:var(--white);border:2px solid var(--border);cursor:pointer;
  color:var(--ink2);transition:all .18s;
}
.pp.on{background:var(--ink);border-color:var(--ink);color:#fff;}

/* Sentence pairs */
.sl{display:flex;flex-direction:column;}
.sp2{padding:16px 0;border-bottom:1px solid var(--border);}
.sp2:last-child{border-bottom:none;}
.en{font-size:15px;line-height:1.65;color:var(--ink);font-weight:700;margin-bottom:5px;}
.ko{font-size:14px;line-height:1.65;color:var(--ink2);}

/* Section card */
.sc{background:var(--white);border:2px solid var(--border);border-radius:var(--radius);padding:22px;margin-bottom:14px;}
.sc-accent-green{border-left:4px solid var(--green);}
.sc-accent-yellow{border-left:4px solid var(--yellow);}
.sct{font-size:10px;font-weight:700;color:var(--ink3);text-transform:uppercase;letter-spacing:.1em;margin-bottom:14px;}

/* Expressions */
.ei{padding:13px 0;border-bottom:1px solid var(--bg);}
.ei:last-child{border-bottom:none;}
.et{display:flex;align-items:center;gap:8px;margin-bottom:4px;}
.etx{font-size:15px;font-weight:700;color:var(--ink);}
.star-badge{background:var(--yellow);color:var(--ink);font-size:10px;font-weight:700;
  padding:2px 7px;border-radius:4px;letter-spacing:.04em;}
.em{font-size:13px;color:var(--ink2);margin-bottom:3px;}
.eex{font-size:13px;color:var(--ink3);font-style:italic;}

/* Conv */
.ci{
  font-size:14px;line-height:1.7;color:var(--ink2);
  padding:10px 14px;margin-bottom:8px;
  background:var(--yellow-light);border-radius:8px;border-left:3px solid var(--yellow);
}
.ci:last-child{margin-bottom:0;}

/* Shadow sent */
.ss{
  font-size:14px;padding:11px 14px;background:var(--green-light);
  border-radius:8px;margin-bottom:8px;color:var(--ink);line-height:1.6;
  border-left:3px solid var(--green);
}
.ss:last-child{margin-bottom:0;}

/* Learning */
.lb{
  font-size:14px;line-height:1.8;color:var(--ink2);
  padding:14px 16px;background:var(--bg);border-radius:10px;
}

/* Memory */
.mi{font-size:13px;color:var(--ink3);margin-bottom:16px;}
.mg{display:grid;grid-template-columns:repeat(auto-fill,minmax(170px,1fr));gap:10px;}
.mc{
  background:var(--white);border-radius:var(--radius);padding:16px;
  border:2px solid var(--border);transition:border-color .2s,transform .15s;
}
.mc:hover{border-color:var(--green);transform:translateY(-2px);}
.mx{font-size:14px;font-weight:700;color:var(--green);margin-bottom:5px;}
.mm{font-size:13px;color:var(--ink2);}

/* Shadowing */
.si2{font-size:13px;color:var(--ink3);margin-bottom:16px;}
.dc{
  background:var(--white);border:2px solid var(--border);
  border-radius:var(--radius);padding:18px 20px;margin-bottom:12px;
}
.dl{
  font-family:'Bebas Neue',sans-serif;font-size:18px;letter-spacing:.04em;
  color:var(--ink);margin-bottom:12px;display:flex;align-items:center;gap:10px;
}
.dl::after{content:'';flex:1;height:2px;background:var(--border);}
.ds{display:flex;gap:12px;padding:9px 0;border-bottom:1px solid var(--bg);
  font-size:14px;color:var(--ink);align-items:flex-start;line-height:1.6;}
.ds:last-child{border-bottom:none;}
.di{
  flex-shrink:0;font-size:10px;font-weight:700;color:var(--white);
  background:var(--ink);border-radius:5px;padding:3px 7px;
  min-width:24px;text-align:center;margin-top:2px;
}

/* Workbook */
.wl{
  font-family:'Bebas Neue',sans-serif;font-size:20px;letter-spacing:.04em;
  color:var(--ink);margin:28px 0 12px;
}
.wl:first-child{margin-top:0;}
.wi{background:var(--white);border:2px solid var(--border);border-radius:var(--radius);padding:16px 18px;margin-bottom:9px;}
.wq{font-size:14px;color:var(--ink);line-height:1.65;margin-bottom:10px;}
.wa{font-size:13px;color:var(--green);font-weight:700;
  padding:8px 12px;background:var(--green-light);border-radius:8px;}
.wr{
  padding:7px 14px;background:transparent;border:2px solid var(--border);
  border-radius:8px;font-size:12px;font-family:inherit;cursor:pointer;
  color:var(--ink2);transition:all .18s;
}
.wr:hover{border-color:var(--green);color:var(--green);}

.mt{width:100%;border-collapse:collapse;font-size:14px;}
.mt th{
  text-align:left;padding:9px 13px;background:var(--bg);
  font-size:11px;font-weight:700;color:var(--ink3);letter-spacing:.06em;text-transform:uppercase;
}
.mt td{padding:11px 13px;border-bottom:1px solid var(--border);color:var(--ink);}
.mt tr:last-child td{border-bottom:none;}
.mh{color:transparent;background:var(--border);border-radius:4px;user-select:none;}
.smb{
  display:block;padding:9px 14px;background:transparent;border:2px solid var(--border);
  border-radius:8px;font-size:12px;font-family:inherit;cursor:pointer;
  color:var(--ink2);margin-top:12px;transition:all .18s;
}
.smb:hover{border-color:var(--ink);color:var(--ink);}

.qi{
  background:var(--white);border:2px solid var(--border);border-radius:var(--radius);
  padding:14px 16px;margin-bottom:9px;display:flex;gap:12px;align-items:flex-start;
}
.qb{
  flex-shrink:0;font-family:'Bebas Neue',sans-serif;font-size:14px;letter-spacing:.04em;
  color:var(--white);background:var(--ink);border-radius:6px;
  padding:3px 9px;margin-top:1px;
}
.qt{font-size:14px;line-height:1.65;color:var(--ink);}

/* ── PRINT STYLES ── */
@media print {
  body{background:#fff!important;color:#000!important;}
  .rh,.tb,.hbtns,.ps,.no-print{display:none!important;}
  .ca{padding:0!important;max-width:100%!important;}
  .sc,.dc,.wi,.mc,.qi{border:1px solid #ddd!important;break-inside:avoid;}
  .print-header{display:block!important;}
}
.print-header{display:none;}
`;

const PRINT_STYLES = `
  body { font-family: 'Noto Sans KR', sans-serif; color: #1A1A1A; }
  .print-doc { max-width: 700px; margin: 0 auto; padding: 20px; }
  .ph { background: #059652; color: white; padding: 20px 24px; border-radius: 8px; margin-bottom: 24px; }
  .ph h1 { font-size: 22px; font-weight: 900; letter-spacing: .04em; margin-bottom: 4px; }
  .ph p { font-size: 13px; opacity: .85; }
  .part-title { font-size: 16px; font-weight: 900; color: #059652; border-bottom: 2px solid #059652; padding-bottom: 6px; margin: 24px 0 14px; }
  .sec-label { font-size: 10px; font-weight: 700; color: #888; text-transform: uppercase; letter-spacing: .1em; margin: 16px 0 8px; }
  .sent-pair { padding: 8px 0; border-bottom: 1px solid #eee; }
  .sent-en { font-size: 14px; font-weight: 700; margin-bottom: 3px; }
  .sent-ko { font-size: 13px; color: #555; }
  table { width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 12px; }
  th { background: #059652; color: white; padding: 7px 10px; text-align: left; font-size: 11px; }
  td { padding: 8px 10px; border-bottom: 1px solid #eee; }
  .shadow-item { padding: 6px 10px; background: #E8F7EE; border-left: 3px solid #059652; margin-bottom: 6px; font-size: 13px; }
  .learn-box { padding: 10px 14px; background: #f5f5f5; border-radius: 6px; font-size: 13px; color: #444; line-height: 1.7; }
  .day-title { font-weight: 700; color: #059652; margin: 12px 0 6px; font-size: 14px; }
  .wb-item { padding: 8px 0; border-bottom: 1px solid #eee; font-size: 13px; }
  .wb-ans { color: #059652; font-weight: 700; }
  .q-item { padding: 8px 12px; background: #f9f9f9; border-radius: 6px; margin-bottom: 6px; font-size: 13px; }
  @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
`;

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

  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
  }, []);

  const reveal = (k) => setReveals(p => ({ ...p, [k]: true }));

  const generate = async () => {
    if (!script.trim()) { setError("영어 스크립트를 먼저 붙여넣어 주세요."); return; }
    setScreen("loading"); setError(""); setReveals({}); setShowMatch(false);
    try {
      const res = await fetch("/api/generate", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ script, title })
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error || "오류"); }
      const parsed = await res.json();
      setResult(parsed); setPartIdx(0); setTab("sentences"); setScreen("result");
    } catch (e) {
      setError(e.message || "오류가 발생했어요."); setScreen("input");
    }
  };

  const printPDF = () => {
    if (!result) return;
    const parts = result.parts || [];

    let html = `<html><head>
      <meta charset="UTF-8"/>
      <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;600;700;900&display=swap" rel="stylesheet"/>
      <style>${PRINT_STYLES}</style>
    </head><body><div class="print-doc">`;

    html += `<div class="ph"><h1>Script2Study</h1><p>${result.title || ""}</p></div>`;

    parts.forEach((part) => {
      html += `<div class="part-title">${part.partTitle || `Part ${part.partNumber}`}</div>`;

      html += `<div class="sec-label">문장별 해석</div>`;
      (part.sentences || []).forEach(s => {
        html += `<div class="sent-pair"><div class="sent-en">${s.en}</div><div class="sent-ko">${s.ko}</div></div>`;
      });

      if (part.keyExpressions?.length) {
        html += `<div class="sec-label">핵심 표현</div>
        <table><thead><tr><th>Expression</th><th>Meaning</th><th>Example</th></tr></thead><tbody>`;
        part.keyExpressions.forEach(e => {
          html += `<tr><td>${e.star ? "⭐ " : ""}${e.expression}</td><td>${e.meaning}</td><td>${e.example}</td></tr>`;
        });
        html += `</tbody></table>`;
      }

      if (part.conversationPoints?.length) {
        html += `<div class="sec-label">회화 포인트</div>`;
        part.conversationPoints.forEach(c => { html += `<div class="shadow-item">${c}</div>`; });
      }

      if (part.shadowingSentences?.length) {
        html += `<div class="sec-label">쉐도잉 문장</div>`;
        part.shadowingSentences.forEach(s => { html += `<div class="shadow-item">${s}</div>`; });
      }

      if (part.learningPoints) {
        html += `<div class="sec-label">학습 포인트</div><div class="learn-box">${part.learningPoints}</div>`;
      }
    });

    if (result.memoryCards?.length) {
      html += `<div class="part-title">전체 암기장</div>
      <table><thead><tr><th>Expression</th><th>Meaning</th></tr></thead><tbody>`;
      result.memoryCards.forEach(m => { html += `<tr><td>${m.expression}</td><td>${m.meaning}</td></tr>`; });
      html += `</tbody></table>`;
    }

    if (result.shadowingTraining?.length) {
      html += `<div class="part-title">쉐도잉 트레이닝</div>`;
      result.shadowingTraining.forEach(day => {
        html += `<div class="day-title">Day ${day.day}</div>`;
        (day.sentences || []).forEach((s, i) => {
          html += `<div class="wb-item">${i + 1}. ${s}</div>`;
        });
      });
    }

    if (result.workbook) {
      const wb = result.workbook;
      html += `<div class="part-title">워크북</div>`;

      if (wb.fillInBlank?.length) {
        html += `<div class="sec-label">1. 빈칸 채우기</div>`;
        wb.fillInBlank.forEach((q, i) => {
          html += `<div class="wb-item">${i + 1}. ${q.question}<br/><span class="wb-ans">정답: ${q.answer}</span></div>`;
        });
      }

      if (wb.matching?.length) {
        html += `<div class="sec-label">2. 표현 매칭</div>
        <table><thead><tr><th>Expression</th><th>Meaning</th></tr></thead><tbody>`;
        wb.matching.forEach(m => { html += `<tr><td>${m.expression}</td><td>${m.meaning}</td></tr>`; });
        html += `</tbody></table>`;
      }

      if (wb.translation?.length) {
        html += `<div class="sec-label">3. 한→영 영작</div>`;
        wb.translation.forEach((t, i) => {
          html += `<div class="wb-item">${i + 1}. ${t.korean}<br/><span class="wb-ans">→ ${t.english}</span></div>`;
        });
      }

      if (wb.speakingQuestions?.length) {
        html += `<div class="sec-label">4. 스스로 말해보기</div>`;
        wb.speakingQuestions.forEach((q, i) => {
          html += `<div class="q-item">Q${i + 1}. ${q}</div>`;
        });
      }
    }

    html += `</div></body></html>`;

    const win = window.open("", "_blank");
    win.document.write(html);
    win.document.close();
    win.onload = () => { win.focus(); win.print(); };
  };

  // ── LOADING
  if (screen === "loading") return (
    <>
      <Head><title>Script2Study — 교재 생성 중</title></Head>
      <style jsx global>{G}</style>
      <div className="load-screen">
        <div className="spinner" />
        <div className="load-title">교재 만드는 중</div>
        <div className="load-sub">보통 10~25초 정도 걸려요</div>
      </div>
    </>
  );

  // ── RESULT
  if (screen === "result" && result) {
    const parts = result.parts || [];
    const part = parts[partIdx] || {};
    const tabs = [
      { id: "sentences", label: "📖 해석" },
      { id: "expressions", label: "💡 표현" },
      { id: "memory", label: "🧠 암기장" },
      { id: "shadowing", label: "🎙 쉐도잉" },
      { id: "workbook", label: "✏️ 워크북" },
    ];

    return (
      <>
        <Head><title>{result.title} — Script2Study</title></Head>
        <style jsx global>{G}</style>
        <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
          <div className="rh">
            <div className="hl">
              <div className="hname">Script<span>2</span>Study</div>
              <div className="htitle">{result.title}</div>
            </div>
            <div className="hbtns">
              <button className="btn-pdf" onClick={printPDF}>⬇ PDF</button>
              <button className="btn-back" onClick={() => { setScreen("input"); setResult(null); }}>← 새 교재</button>
            </div>
          </div>

          <div className="tb">
            {tabs.map(t => (
              <button key={t.id} className={`tbtn ${tab === t.id ? "on" : ""}`} onClick={() => setTab(t.id)}>
                {t.label}
              </button>
            ))}
          </div>

          <div className="ca">
            {parts.length > 1 && ["sentences", "expressions"].includes(tab) && (
              <div className="ps">
                {parts.map((p, i) => (
                  <button key={i} className={`pp ${partIdx === i ? "on" : ""}`} onClick={() => setPartIdx(i)}>
                    {p.partTitle || `Part ${i + 1}`}
                  </button>
                ))}
              </div>
            )}

            {tab === "sentences" && (
              <>
                <div className="sl">
                  {(part.sentences || []).map((s, i) => (
                    <div key={i} className="sp2">
                      <div className="en">{s.en}</div>
                      <div className="ko">{s.ko}</div>
                    </div>
                  ))}
                </div>
                {part.shadowingSentences?.length > 0 && (
                  <div className="sc sc-accent-green" style={{ marginTop: 22 }}>
                    <div className="sct">🎙 이 파트 쉐도잉</div>
                    {part.shadowingSentences.map((s, i) => <div key={i} className="ss">{s}</div>)}
                  </div>
                )}
                {part.learningPoints && (
                  <div className="sc sc-accent-yellow">
                    <div className="sct">📌 학습 포인트</div>
                    <div className="lb">{part.learningPoints}</div>
                  </div>
                )}
              </>
            )}

            {tab === "expressions" && (
              <>
                <div className="sc sc-accent-green">
                  <div className="sct">💡 핵심 표현</div>
                  {(part.keyExpressions || []).map((e, i) => (
                    <div key={i} className="ei">
                      <div className="et">
                        <span className="etx">{e.expression}</span>
                        {e.star && <span className="star-badge">PICK</span>}
                      </div>
                      <div className="em">{e.meaning}</div>
                      <div className="eex">예) {e.example}</div>
                    </div>
                  ))}
                </div>
                {(part.conversationPoints || []).length > 0 && (
                  <div className="sc sc-accent-yellow">
                    <div className="sct">💬 회화 포인트</div>
                    {part.conversationPoints.map((c, i) => <div key={i} className="ci">{c}</div>)}
                  </div>
                )}
              </>
            )}

            {tab === "memory" && (
              <>
                <div className="mi">회화에서 바로 꺼낼 수 있는 표현만 모았어요 📌</div>
                <div className="mg">
                  {(result.memoryCards || []).map((m, i) => (
                    <div key={i} className="mc">
                      <div className="mx">{m.expression}</div>
                      <div className="mm">{m.meaning}</div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {tab === "shadowing" && (
              <>
                <div className="si2">Day 1부터 소리 내서 따라 말해보세요 🎙</div>
                {(result.shadowingTraining || []).map((day, i) => (
                  <div key={i} className="dc">
                    <div className="dl">Day {day.day}</div>
                    {(day.sentences || []).map((s, j) => (
                      <div key={j} className="ds">
                        <span className="di">{j + 1}</span>
                        <span>{s}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </>
            )}

            {tab === "workbook" && (
              <>
                <div className="wl">1. 빈칸 채우기</div>
                {(result.workbook?.fillInBlank || []).map((q, i) => (
                  <div key={i} className="wi">
                    <div className="wq">{i + 1}. {q.question}</div>
                    {reveals[`f${i}`] ? <div className="wa">정답: {q.answer}</div>
                      : <button className="wr" onClick={() => reveal(`f${i}`)}>정답 보기</button>}
                  </div>
                ))}
                <div className="wl">2. 표현 매칭</div>
                <div className="wi">
                  <table className="mt">
                    <thead><tr><th>표현</th><th>뜻</th></tr></thead>
                    <tbody>
                      {(result.workbook?.matching || []).map((m, i) => (
                        <tr key={i}>
                          <td>{m.expression}</td>
                          <td className={showMatch ? "" : "mh"}>{m.meaning}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <button className="smb" onClick={() => setShowMatch(p => !p)}>
                    {showMatch ? "뜻 숨기기" : "뜻 보기"}
                  </button>
                </div>
                <div className="wl">3. 한→영 영작</div>
                {(result.workbook?.translation || []).map((t, i) => (
                  <div key={i} className="wi">
                    <div className="wq">{i + 1}. {t.korean}</div>
                    {reveals[`t${i}`] ? <div className="wa">{t.english}</div>
                      : <button className="wr" onClick={() => reveal(`t${i}`)}>정답 보기</button>}
                  </div>
                ))}
                <div className="wl">4. 스스로 말해보기</div>
                {(result.workbook?.speakingQuestions || []).map((q, i) => (
                  <div key={i} className="qi">
                    <span className="qb">Q{i + 1}</span>
                    <span className="qt">{q}</span>
                  </div>
                ))}
              </>
            )}
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
      <div className="input-bg">
        <div className="input-wrap">
          <div className="brand">
            <div className="brand-name">Script<span>2</span>Study</div>
            <span className="brand-tag">영어 교재 자동 생성기</span>
          </div>
          <div className="field">
            <label className="lbl">콘텐츠 제목 (선택)</label>
            <input className="inp" type="text" placeholder="예: Hey Tablo EP.1 — MBTI는 옛말?"
              value={title} onChange={e => setTitle(e.target.value)} />
          </div>
          <div className="field">
            <label className="lbl">영어 스크립트 * (최대 10,000자)</label>
            <textarea className="inp ta"
              placeholder={"여기에 영어 원문을 붙여넣으세요\n팟캐스트, 유튜브, 드라마 대본, 인터뷰 등 모두 OK"}
              value={script} onChange={e => setScript(e.target.value)} />
            <div className="cnt">{script.length.toLocaleString()} / 10,000자</div>
          </div>
          <button className="btn-gen" onClick={generate} disabled={!script.trim()}>
            교재 자동 생성 →
          </button>
          {error && <div className="err">{error}</div>}
          <div className="tip">
            💡 <strong>Tip.</strong> 최대 10,000자까지 지원해요. 긴 스크립트는 Sonnet 모델로 자동 전환돼요.
          </div>
        </div>
      </div>
    </>
  );
}
