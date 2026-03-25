import { useState, useEffect } from "react";
import Head from "next/head";

const G = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Pretendard:wght@400;500;600;700&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
body{font-family:'Pretendard',system-ui,sans-serif;background:#0f0f0f;color:#f0ece4;min-height:100vh;}

/* ── INPUT ── */
.wrap{min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px;
  background:radial-gradient(ellipse 80% 60% at 50% 0%,rgba(16,185,129,0.12),transparent);}
.card{background:#1a1a1a;border:1px solid #2a2a2a;border-radius:24px;padding:44px 40px;max-width:580px;width:100%;
  box-shadow:0 40px 80px rgba(0,0,0,.5);}
@media(max-width:480px){.card{padding:28px 22px;border-radius:18px;}}
.logo{font-family:'Playfair Display',serif;font-size:32px;font-weight:900;letter-spacing:-0.02em;
  background:linear-gradient(135deg,#10b981,#34d399);-webkit-background-clip:text;-webkit-text-fill-color:transparent;
  background-clip:text;margin-bottom:6px;}
.logo-sub{font-size:13px;color:#666;margin-bottom:32px;}
.lbl{display:block;font-size:11px;font-weight:700;color:#888;letter-spacing:.08em;text-transform:uppercase;margin-bottom:8px;}
.inp{width:100%;padding:12px 16px;background:#111;border:1.5px solid #2a2a2a;border-radius:12px;
  font-size:14px;font-family:inherit;color:#f0ece4;outline:none;transition:border-color .2s;}
.inp:focus{border-color:#10b981;}
.inp::placeholder{color:#444;}
.ta{height:180px;resize:vertical;line-height:1.65;}
.cnt{font-size:11px;color:#555;text-align:right;margin-top:5px;}
.fg{margin-bottom:18px;}
.btn-main{width:100%;padding:15px;background:linear-gradient(135deg,#10b981,#059669);color:#fff;border:none;
  border-radius:12px;font-size:15px;font-weight:700;font-family:inherit;cursor:pointer;
  transition:opacity .2s,transform .12s;margin-top:4px;letter-spacing:-.01em;}
.btn-main:hover{opacity:.9;transform:translateY(-1px);}
.btn-main:disabled{opacity:.35;cursor:not-allowed;transform:none;}
.err{font-size:13px;color:#f87171;text-align:center;margin-top:10px;}
.tip{margin-top:22px;padding:14px 16px;background:rgba(16,185,129,.07);border-radius:12px;
  border-left:3px solid #10b981;font-size:13px;color:#888;line-height:1.7;}

/* ── LOADING ── */
.ls{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:18px;
  background:radial-gradient(ellipse 80% 60% at 50% 0%,rgba(16,185,129,.1),transparent);}
.sp{width:48px;height:48px;border:3px solid #2a2a2a;border-top-color:#10b981;border-radius:50%;animation:spin .7s linear infinite;}
@keyframes spin{to{transform:rotate(360deg);}}
.lt{font-family:'Playfair Display',serif;font-size:24px;}
.ls2{font-size:14px;color:#666;}

/* ── RESULT HEADER ── */
.rh{background:#111;border-bottom:1px solid #1e1e1e;padding:0 20px;display:flex;align-items:center;
  justify-content:space-between;position:sticky;top:0;z-index:20;gap:12px;height:56px;}
.hl{min-width:0;}
.hlogo{font-family:'Playfair Display',serif;font-size:18px;font-weight:900;
  background:linear-gradient(135deg,#10b981,#34d399);-webkit-background-clip:text;
  -webkit-text-fill-color:transparent;background-clip:text;line-height:1;}
.htitle{font-size:12px;color:#666;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:260px;margin-top:2px;}
.hbtns{display:flex;gap:8px;flex-shrink:0;}
.btn-pdf{padding:7px 14px;background:linear-gradient(135deg,#10b981,#059669);color:#fff;border:none;
  border-radius:8px;font-size:12px;font-weight:700;font-family:inherit;cursor:pointer;white-space:nowrap;transition:opacity .2s;}
.btn-pdf:hover{opacity:.85;}
.btn-back{padding:7px 14px;background:transparent;border:1.5px solid #2a2a2a;border-radius:8px;
  font-size:12px;font-family:inherit;cursor:pointer;color:#888;white-space:nowrap;transition:all .18s;}
.btn-back:hover{border-color:#10b981;color:#10b981;}

/* ── TABS ── */
.tb{background:#111;padding:0 16px;display:flex;border-bottom:1px solid #1e1e1e;
  overflow-x:auto;-webkit-overflow-scrolling:touch;scrollbar-width:none;}
.tb::-webkit-scrollbar{display:none;}
.tbtn{flex-shrink:0;padding:13px 14px;font-size:13px;font-weight:500;font-family:inherit;
  background:none;border:none;border-bottom:2px solid transparent;cursor:pointer;
  color:#555;white-space:nowrap;transition:all .18s;}
.tbtn.on{color:#10b981;border-bottom-color:#10b981;font-weight:700;}
.tbtn:hover:not(.on){color:#aaa;}

/* ── CONTENT ── */
.ca{max-width:760px;margin:0 auto;padding:24px 18px 80px;}

/* Part pills */
.ps{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:20px;}
.pp{padding:6px 14px;border-radius:999px;font-size:12px;font-weight:600;font-family:inherit;
  background:#1a1a1a;border:1.5px solid #2a2a2a;cursor:pointer;color:#888;transition:all .18s;}
.pp.on{background:#10b981;border-color:#10b981;color:#fff;}

/* Sentences */
.sl{display:flex;flex-direction:column;}
.sp2{padding:15px 0;border-bottom:1px solid #1e1e1e;}
.sp2:last-child{border-bottom:none;}
.en{font-size:15px;line-height:1.65;color:#f0ece4;font-weight:600;margin-bottom:5px;}
.ko{font-size:14px;line-height:1.65;color:#888;}

/* Cards */
.sc{background:#1a1a1a;border:1px solid #2a2a2a;border-radius:16px;padding:20px 22px;margin-bottom:12px;}
.sct{font-size:10px;font-weight:700;color:#10b981;text-transform:uppercase;letter-spacing:.1em;margin-bottom:14px;}

/* Expressions */
.ei{padding:12px 0;border-bottom:1px solid #111;}
.ei:last-child{border-bottom:none;}
.et{display:flex;align-items:center;gap:7px;margin-bottom:3px;}
.etx{font-size:15px;font-weight:700;color:#f0ece4;}
.em{font-size:13px;color:#aaa;margin-bottom:3px;}
.eex{font-size:13px;color:#555;font-style:italic;}

/* Conv */
.ci{font-size:14px;line-height:1.7;color:#aaa;padding:9px 0;border-bottom:1px solid #111;}
.ci:last-child{border-bottom:none;}

/* Shadow sent */
.ss{font-size:14px;padding:11px 14px;background:#111;border-radius:8px;margin-bottom:8px;
  color:#f0ece4;line-height:1.6;border-left:2px solid #10b981;}
.ss:last-child{margin-bottom:0;}

/* Learning */
.lb{font-size:14px;line-height:1.8;color:#aaa;padding:14px 16px;
  background:rgba(16,185,129,.06);border-radius:10px;border-left:3px solid #10b981;}

/* Memory */
.mi{font-size:13px;color:#666;margin-bottom:16px;}
.mg{display:grid;grid-template-columns:repeat(auto-fill,minmax(175px,1fr));gap:10px;}
.mc{background:#1a1a1a;border-radius:12px;padding:15px 16px;border:1.5px solid #2a2a2a;transition:border-color .2s;}
.mc:hover{border-color:#10b981;}
.mx{font-size:14px;font-weight:700;color:#10b981;margin-bottom:5px;}
.mm{font-size:13px;color:#888;}

/* Shadowing */
.si2{font-size:13px;color:#666;margin-bottom:16px;}
.dc{background:#1a1a1a;border-radius:14px;padding:18px 20px;margin-bottom:12px;border:1px solid #2a2a2a;}
.dl{font-size:12px;font-weight:700;color:#10b981;margin-bottom:13px;display:flex;align-items:center;gap:8px;}
.dl::after{content:'';flex:1;height:1px;background:#222;}
.ds{display:flex;gap:11px;padding:9px 0;border-bottom:1px solid #1e1e1e;font-size:14px;
  color:#f0ece4;align-items:flex-start;line-height:1.6;}
.ds:last-child{border-bottom:none;}
.di{flex-shrink:0;font-size:10px;font-weight:700;color:#10b981;background:rgba(16,185,129,.1);
  border-radius:5px;padding:2px 7px;min-width:24px;text-align:center;margin-top:2px;}

/* Workbook */
.wl{font-size:15px;font-weight:700;color:#f0ece4;margin:28px 0 12px;}
.wl:first-child{margin-top:0;}
.wi{background:#1a1a1a;border-radius:12px;padding:15px 17px;margin-bottom:9px;border:1px solid #2a2a2a;}
.wq{font-size:14px;color:#f0ece4;line-height:1.65;margin-bottom:9px;}
.wa{font-size:13px;color:#10b981;font-weight:700;padding:8px 12px;
  background:rgba(16,185,129,.08);border-radius:8px;}
.wr{padding:7px 13px;background:transparent;border:1.5px solid #2a2a2a;border-radius:8px;
  font-size:12px;font-family:inherit;cursor:pointer;color:#666;transition:all .18s;}
.wr:hover{border-color:#10b981;color:#10b981;}
.mt{width:100%;border-collapse:collapse;font-size:14px;}
.mt th{text-align:left;padding:8px 12px;background:#111;font-size:10px;font-weight:700;color:#666;
  letter-spacing:.08em;text-transform:uppercase;}
.mt td{padding:10px 12px;border-bottom:1px solid #1e1e1e;color:#f0ece4;}
.mt tr:last-child td{border-bottom:none;}
.mh{color:transparent;background:#222;border-radius:4px;user-select:none;}
.smb{display:block;padding:9px 14px;background:transparent;border:1.5px solid #2a2a2a;border-radius:8px;
  font-size:12px;font-family:inherit;cursor:pointer;color:#666;margin-top:12px;transition:all .18s;}
.smb:hover{border-color:#10b981;color:#10b981;}
.qi{background:#1a1a1a;border-radius:12px;padding:14px 16px;margin-bottom:9px;
  display:flex;gap:11px;align-items:flex-start;border:1px solid #2a2a2a;}
.qb{flex-shrink:0;font-size:10px;font-weight:700;color:#fff;background:#10b981;
  border-radius:6px;padding:3px 8px;margin-top:1px;}
.qt{font-size:14px;line-height:1.65;color:#f0ece4;}
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
  const [pdfLoading, setPdfLoading] = useState(false);

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

  const downloadPDF = async () => {
    if (!result) return;
    setPdfLoading(true);
    try {
      const { default: jsPDF } = await import("jspdf");
      const { default: autoTable } = await import("jspdf-autotable");
      const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

      const W = 210, margin = 18;
      let y = margin;

      const addPage = () => { doc.addPage(); y = margin; };
      const checkY = (needed = 10) => { if (y + needed > 277) addPage(); };

      // Header
      doc.setFillColor(16, 185, 129);
      doc.rect(0, 0, W, 28, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.text("Script2Study", margin, 12);
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(result.title || "English Study Workbook", margin, 21);
      y = 38;

      const addSection = (label) => {
        checkY(12);
        doc.setFillColor(240, 253, 244);
        doc.roundedRect(margin - 2, y - 5, W - (margin - 2) * 2, 8, 2, 2, "F");
        doc.setTextColor(5, 150, 105);
        doc.setFontSize(9);
        doc.setFont("helvetica", "bold");
        doc.text(label, margin, y);
        y += 7;
        doc.setTextColor(30, 30, 30);
        doc.setFont("helvetica", "normal");
      };

      // Parts
      (result.parts || []).forEach((part, pi) => {
        checkY(15);
        doc.setFontSize(13);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(16, 185, 129);
        doc.text(part.partTitle || `Part ${pi + 1}`, margin, y);
        y += 8;

        // Sentences
        addSection("문장별 해석");
        (part.sentences || []).forEach(s => {
          checkY(16);
          doc.setFontSize(10);
          doc.setFont("helvetica", "bold");
          doc.setTextColor(20, 20, 20);
          const enLines = doc.splitTextToSize(s.en, W - margin * 2);
          doc.text(enLines, margin, y);
          y += enLines.length * 5 + 1;
          doc.setFont("helvetica", "normal");
          doc.setTextColor(100, 100, 100);
          const koLines = doc.splitTextToSize(s.ko, W - margin * 2);
          doc.text(koLines, margin, y);
          y += koLines.length * 5 + 4;
        });
        y += 3;

        // Key expressions table
        if (part.keyExpressions?.length) {
          addSection("핵심 표현");
          autoTable(doc, {
            startY: y,
            head: [["Expression", "Meaning", "Example"]],
            body: part.keyExpressions.map(e => [
              (e.star ? "⭐ " : "") + e.expression, e.meaning, e.example
            ]),
            theme: "striped",
            headStyles: { fillColor: [16, 185, 129], textColor: 255, fontSize: 9, fontStyle: "bold" },
            bodyStyles: { fontSize: 9, textColor: [40, 40, 40] },
            alternateRowStyles: { fillColor: [245, 253, 248] },
            margin: { left: margin, right: margin },
            columnStyles: { 0: { cellWidth: 42 }, 1: { cellWidth: 48 }, 2: { cellWidth: "auto" } }
          });
          y = doc.lastAutoTable.finalY + 6;
        }

        // Shadowing sentences
        if (part.shadowingSentences?.length) {
          addSection("쉐도잉 문장");
          part.shadowingSentences.forEach((s, i) => {
            checkY(8);
            doc.setFontSize(9.5);
            doc.setFont("helvetica", "normal");
            doc.setTextColor(40, 40, 40);
            doc.text(`${i + 1}. ${s}`, margin, y);
            y += 6;
          });
          y += 3;
        }

        // Learning points
        if (part.learningPoints) {
          addSection("학습 포인트");
          const lines = doc.splitTextToSize(part.learningPoints, W - margin * 2);
          doc.setFontSize(9.5);
          doc.setTextColor(60, 60, 60);
          doc.text(lines, margin, y);
          y += lines.length * 5 + 8;
        }
      });

      // Memory cards
      if (result.memoryCards?.length) {
        checkY(20);
        doc.setFontSize(13);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(16, 185, 129);
        doc.text("전체 암기장", margin, y);
        y += 8;
        autoTable(doc, {
          startY: y,
          head: [["Expression", "Meaning"]],
          body: result.memoryCards.map(m => [m.expression, m.meaning]),
          theme: "striped",
          headStyles: { fillColor: [16, 185, 129], textColor: 255, fontSize: 9, fontStyle: "bold" },
          bodyStyles: { fontSize: 9, textColor: [40, 40, 40] },
          alternateRowStyles: { fillColor: [245, 253, 248] },
          margin: { left: margin, right: margin },
          columnStyles: { 0: { cellWidth: 65 } }
        });
        y = doc.lastAutoTable.finalY + 8;
      }

      // Shadowing training
      if (result.shadowingTraining?.length) {
        checkY(20);
        doc.setFontSize(13);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(16, 185, 129);
        doc.text("쉐도잉 트레이닝", margin, y);
        y += 8;
        result.shadowingTraining.forEach(day => {
          checkY(8);
          doc.setFontSize(10);
          doc.setFont("helvetica", "bold");
          doc.setTextColor(16, 185, 129);
          doc.text(`Day ${day.day}`, margin, y);
          y += 5;
          doc.setFont("helvetica", "normal");
          doc.setTextColor(40, 40, 40);
          (day.sentences || []).forEach((s, i) => {
            checkY(7);
            doc.setFontSize(9.5);
            const lines = doc.splitTextToSize(`${i + 1}. ${s}`, W - margin * 2 - 5);
            doc.text(lines, margin + 3, y);
            y += lines.length * 5 + 1;
          });
          y += 4;
        });
      }

      // Workbook
      if (result.workbook) {
        checkY(20);
        doc.setFontSize(13);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(16, 185, 129);
        doc.text("워크북", margin, y);
        y += 9;

        const wb = result.workbook;

        // Fill in blank
        if (wb.fillInBlank?.length) {
          addSection("1. 빈칸 채우기");
          wb.fillInBlank.forEach((q, i) => {
            checkY(12);
            doc.setFontSize(9.5);
            doc.setFont("helvetica", "normal");
            doc.setTextColor(40, 40, 40);
            const lines = doc.splitTextToSize(`${i + 1}. ${q.question}`, W - margin * 2);
            doc.text(lines, margin, y);
            y += lines.length * 5 + 1;
            doc.setTextColor(16, 185, 129);
            doc.text(`정답: ${q.answer}`, margin + 4, y);
            y += 6;
          });
          y += 3;
        }

        // Translation
        if (wb.translation?.length) {
          addSection("2. 한→영 영작");
          wb.translation.forEach((t, i) => {
            checkY(12);
            doc.setFontSize(9.5);
            doc.setFont("helvetica", "normal");
            doc.setTextColor(40, 40, 40);
            doc.text(`${i + 1}. ${t.korean}`, margin, y);
            y += 5;
            doc.setTextColor(16, 185, 129);
            doc.text(`→ ${t.english}`, margin + 4, y);
            y += 6;
          });
          y += 3;
        }

        // Speaking
        if (wb.speakingQuestions?.length) {
          addSection("3. 스스로 말해보기");
          wb.speakingQuestions.forEach((q, i) => {
            checkY(8);
            doc.setFontSize(9.5);
            doc.setFont("helvetica", "normal");
            doc.setTextColor(40, 40, 40);
            const lines = doc.splitTextToSize(`Q${i + 1}. ${q}`, W - margin * 2);
            doc.text(lines, margin, y);
            y += lines.length * 5 + 4;
          });
        }
      }

      // Footer on all pages
      const total = doc.internal.getNumberOfPages();
      for (let i = 1; i <= total; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(180, 180, 180);
        doc.text(`Script2Study  •  ${result.title}  •  ${i} / ${total}`, W / 2, 290, { align: "center" });
      }

      doc.save(`${result.title || "script2study"}.pdf`);
    } catch (e) {
      console.error(e);
      alert("PDF 생성 중 오류가 발생했어요.");
    }
    setPdfLoading(false);
  };

  // ── LOADING
  if (screen === "loading") return (
    <>
      <Head><title>Script2Study — 교재 생성 중</title></Head>
      <style jsx global>{G}</style>
      <div className="ls">
        <div className="sp" />
        <div className="lt">교재 만드는 중...</div>
        <div className="ls2">보통 10~20초 정도 걸려요</div>
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
        <div style={{ minHeight: "100vh", background: "#0f0f0f" }}>
          <div className="rh">
            <div className="hl">
              <div className="hlogo">Script2Study</div>
              <div className="htitle">{result.title}</div>
            </div>
            <div className="hbtns">
              <button className="btn-pdf" onClick={downloadPDF} disabled={pdfLoading}>
                {pdfLoading ? "..." : "⬇ PDF"}
              </button>
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
                  <div className="sc" style={{ marginTop: 22 }}>
                    <div className="sct">🎙 이 파트 쉐도잉</div>
                    {part.shadowingSentences.map((s, i) => <div key={i} className="ss">{s}</div>)}
                  </div>
                )}
                {part.learningPoints && (
                  <div className="sc">
                    <div className="sct">📌 학습 포인트</div>
                    <div className="lb">{part.learningPoints}</div>
                  </div>
                )}
              </>
            )}

            {tab === "expressions" && (
              <>
                <div className="sc">
                  <div className="sct">💡 핵심 표현</div>
                  {(part.keyExpressions || []).map((e, i) => (
                    <div key={i} className="ei">
                      <div className="et">
                        <span className="etx">{e.expression}</span>
                        {e.star && <span>⭐</span>}
                      </div>
                      <div className="em">{e.meaning}</div>
                      <div className="eex">예) {e.example}</div>
                    </div>
                  ))}
                </div>
                {(part.conversationPoints || []).length > 0 && (
                  <div className="sc">
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
      <Head><title>Script2Study — 영어 교재 자동 생성</title></Head>
      <style jsx global>{G}</style>
      <div className="wrap">
        <div className="card">
          <div className="logo">Script2Study</div>
          <div className="logo-sub">영어 스크립트를 붙여넣으면 완성형 학습 교재를 자동으로 만들어 드려요</div>
          <div className="fg">
            <label className="lbl">콘텐츠 제목 (선택)</label>
            <input className="inp" type="text" placeholder="예: Hey Tablo EP.1 — MBTI는 옛말?" value={title} onChange={e => setTitle(e.target.value)} />
          </div>
          <div className="fg">
            <label className="lbl">영어 스크립트 *</label>
            <textarea className="inp ta" placeholder={"여기에 영어 원문을 붙여넣으세요\n팟캐스트, 유튜브, 드라마 대본, 인터뷰 등 모두 OK"} value={script} onChange={e => setScript(e.target.value)} />
            <div className="cnt">{script.length.toLocaleString()}자</div>
          </div>
          <button className="btn-main" onClick={generate} disabled={!script.trim()}>
            교재 자동 생성 →
          </button>
          {error && <div className="err">{error}</div>}
          <div className="tip">
            💡 <strong>Tip.</strong> 200~800자 분량이 가장 잘 나와요. 긴 스크립트는 나눠서 넣어주세요.
          </div>
        </div>
      </div>
    </>
  );
}
