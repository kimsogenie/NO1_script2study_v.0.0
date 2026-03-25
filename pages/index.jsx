import { useState } from "react";
import Head from "next/head";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Noto+Sans+KR:wght@400;500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: 'Noto Sans KR', sans-serif;
    background: #F2EFE9;
    color: #1C1917;
    min-height: 100vh;
  }

  .app { min-height: 100vh; background: #F2EFE9; }

  .input-screen {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
  }

  .input-card {
    background: #fff;
    border-radius: 22px;
    padding: 44px 42px;
    max-width: 600px;
    width: 100%;
    box-shadow: 0 8px 40px rgba(0,0,0,0.09);
  }

  @media (max-width: 480px) {
    .input-card { padding: 28px 22px; border-radius: 18px; }
  }

  .brand-row { margin-bottom: 30px; }
  .brand-logo { font-family: 'DM Serif Display', serif; font-size: 30px; color: #1C1917; line-height: 1; margin-bottom: 6px; }
  .brand-logo span { color: #059669; }
  .brand-desc { font-size: 13px; color: #78716C; }

  .field-group { margin-bottom: 18px; }
  .field-label { display: block; font-size: 12px; font-weight: 700; color: #44403C; letter-spacing: 0.06em; text-transform: uppercase; margin-bottom: 8px; }

  .input-title {
    width: 100%; padding: 11px 15px; border: 1.5px solid #E7E5E0;
    border-radius: 10px; font-size: 14px; font-family: inherit;
    background: #FAFAF8; color: #1C1917; outline: none; transition: border-color 0.2s;
  }
  .input-title:focus { border-color: #059669; background: #fff; }
  .input-title::placeholder { color: #C4BFBA; }

  .input-textarea {
    width: 100%; height: 190px; padding: 14px 15px; border: 1.5px solid #E7E5E0;
    border-radius: 10px; font-size: 14px; font-family: inherit; background: #FAFAF8;
    color: #1C1917; outline: none; resize: vertical; transition: border-color 0.2s; line-height: 1.65;
  }
  .input-textarea:focus { border-color: #059669; background: #fff; }
  .input-textarea::placeholder { color: #C4BFBA; }

  .char-count { font-size: 11px; color: #A8A29E; text-align: right; margin-top: 5px; }

  .btn-generate {
    width: 100%; padding: 14px; background: #059669; color: #fff; border: none;
    border-radius: 11px; font-size: 15px; font-weight: 700; font-family: inherit;
    cursor: pointer; transition: background 0.2s, transform 0.12s; margin-top: 6px; letter-spacing: -0.01em;
  }
  .btn-generate:hover { background: #047857; transform: translateY(-1px); }
  .btn-generate:active { transform: translateY(0); }
  .btn-generate:disabled { background: #A7F3D0; cursor: not-allowed; transform: none; }

  .error-msg { font-size: 13px; color: #DC2626; margin-top: 10px; text-align: center; }

  .tip-box {
    margin-top: 22px; padding: 13px 15px; background: #F0FDF4;
    border-radius: 10px; border-left: 3px solid #059669;
    font-size: 13px; color: #4B5563; line-height: 1.65;
  }

  .loading-screen {
    min-height: 100vh; display: flex; flex-direction: column;
    align-items: center; justify-content: center; gap: 16px;
  }
  .spinner {
    width: 44px; height: 44px; border: 3px solid #E7E5E0;
    border-top-color: #059669; border-radius: 50%;
    animation: spin 0.75s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  .loading-title { font-family: 'DM Serif Display', serif; font-size: 22px; color: #1C1917; }
  .loading-sub { font-size: 14px; color: #78716C; }

  .result-screen { min-height: 100vh; }

  .result-header {
    background: #fff; border-bottom: 1px solid #E7E5E0;
    padding: 14px 24px; display: flex; align-items: center;
    justify-content: space-between; position: sticky; top: 0; z-index: 20; gap: 16px;
  }
  .header-left { min-width: 0; }
  .header-brand { font-family: 'DM Serif Display', serif; font-size: 18px; color: #1C1917; line-height: 1; margin-bottom: 3px; }
  .header-brand span { color: #059669; }
  .header-doc-title { font-size: 13px; color: #78716C; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 240px; }

  .btn-back {
    flex-shrink: 0; padding: 8px 14px; background: transparent; border: 1.5px solid #E7E5E0;
    border-radius: 8px; font-size: 13px; font-family: inherit; cursor: pointer;
    color: #44403C; transition: all 0.2s; white-space: nowrap;
  }
  .btn-back:hover { border-color: #059669; color: #059669; }

  .tab-bar {
    background: #fff; padding: 0 20px; display: flex;
    border-bottom: 1px solid #E7E5E0; overflow-x: auto;
    -webkit-overflow-scrolling: touch; scrollbar-width: none;
  }
  .tab-bar::-webkit-scrollbar { display: none; }

  .tab-btn {
    flex-shrink: 0; padding: 12px 14px; font-size: 13px; font-weight: 500;
    font-family: inherit; background: none; border: none;
    border-bottom: 2px solid transparent; cursor: pointer; color: #78716C;
    white-space: nowrap; transition: all 0.18s;
  }
  .tab-btn.active { color: #059669; border-bottom-color: #059669; font-weight: 700; }
  .tab-btn:hover:not(.active) { color: #44403C; }

  .content-area { max-width: 780px; margin: 0 auto; padding: 24px 20px 60px; }

  .part-selector { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 22px; }
  .part-pill {
    padding: 6px 14px; border-radius: 999px; font-size: 12px; font-weight: 600;
    font-family: inherit; background: #fff; border: 1.5px solid #E7E5E0;
    cursor: pointer; color: #44403C; transition: all 0.18s;
  }
  .part-pill.active { background: #059669; border-color: #059669; color: #fff; }

  .sentence-list { display: flex; flex-direction: column; }
  .sentence-pair { padding: 15px 0; border-bottom: 1px solid #EAE7E1; }
  .sentence-pair:last-child { border-bottom: none; }
  .sentence-en { font-size: 15px; line-height: 1.65; color: #1C1917; font-weight: 600; margin-bottom: 5px; }
  .sentence-ko { font-size: 14px; line-height: 1.65; color: #57534E; }

  .sec-card { background: #fff; border-radius: 14px; padding: 20px 22px; margin-bottom: 14px; }
  .sec-card-title { font-size: 11px; font-weight: 700; color: #059669; text-transform: uppercase; letter-spacing: 0.09em; margin-bottom: 14px; }

  .expr-item { padding: 12px 0; border-bottom: 1px solid #F2EFE9; }
  .expr-item:last-child { border-bottom: none; }
  .expr-top { display: flex; align-items: center; gap: 7px; margin-bottom: 3px; }
  .expr-text { font-size: 15px; font-weight: 700; color: #1C1917; }
  .expr-meaning { font-size: 13px; color: #44403C; margin-bottom: 3px; }
  .expr-example { font-size: 13px; color: #78716C; font-style: italic; }

  .conv-item { font-size: 14px; line-height: 1.7; color: #44403C; padding: 9px 0; border-bottom: 1px solid #F2EFE9; }
  .conv-item:last-child { border-bottom: none; }

  .shadow-sent { font-size: 14px; padding: 10px 13px; background: #F2EFE9; border-radius: 8px; margin-bottom: 8px; color: #1C1917; line-height: 1.6; }
  .shadow-sent:last-child { margin-bottom: 0; }

  .learning-box { font-size: 14px; line-height: 1.8; color: #44403C; padding: 14px 16px; background: #F0FDF4; border-radius: 10px; border-left: 3px solid #059669; }

  .memory-intro { font-size: 13px; color: #78716C; margin-bottom: 16px; }
  .memory-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 10px; }
  .mem-card { background: #fff; border-radius: 12px; padding: 15px 16px; border: 1.5px solid #E7E5E0; }
  .mem-expr { font-size: 14px; font-weight: 700; color: #059669; margin-bottom: 5px; }
  .mem-meaning { font-size: 13px; color: #44403C; }

  .shadow-intro { font-size: 13px; color: #78716C; margin-bottom: 16px; }
  .day-card { background: #fff; border-radius: 14px; padding: 18px 20px; margin-bottom: 12px; }
  .day-label { font-size: 13px; font-weight: 700; color: #059669; margin-bottom: 13px; display: flex; align-items: center; gap: 8px; }
  .day-label::after { content: ''; flex: 1; height: 1px; background: #F2EFE9; }
  .day-sent { display: flex; gap: 11px; padding: 9px 0; border-bottom: 1px solid #F2EFE9; font-size: 14px; color: #1C1917; align-items: flex-start; line-height: 1.6; }
  .day-sent:last-child { border-bottom: none; }
  .sent-idx { flex-shrink: 0; font-size: 11px; font-weight: 700; color: #059669; background: #F0FDF4; border-radius: 5px; padding: 2px 7px; min-width: 26px; text-align: center; margin-top: 2px; }

  .wb-section-label { font-size: 15px; font-weight: 700; color: #1C1917; margin: 28px 0 13px; }
  .wb-section-label:first-child { margin-top: 0; }
  .wb-item { background: #fff; border-radius: 12px; padding: 15px 17px; margin-bottom: 9px; }
  .wb-q { font-size: 14px; color: #1C1917; line-height: 1.65; margin-bottom: 8px; }
  .wb-answer { font-size: 13px; color: #059669; font-weight: 700; padding: 8px 12px; background: #F0FDF4; border-radius: 8px; }
  .wb-reveal { padding: 7px 13px; background: transparent; border: 1.5px solid #E7E5E0; border-radius: 8px; font-size: 12px; font-family: inherit; cursor: pointer; color: #78716C; transition: all 0.18s; }
  .wb-reveal:hover { border-color: #059669; color: #059669; }

  .match-table { width: 100%; border-collapse: collapse; font-size: 14px; }
  .match-table th { text-align: left; padding: 8px 12px; background: #F2EFE9; font-size: 11px; font-weight: 700; color: #78716C; letter-spacing: 0.06em; text-transform: uppercase; }
  .match-table td { padding: 10px 12px; border-bottom: 1px solid #F2EFE9; }
  .match-table tr:last-child td { border-bottom: none; }
  .match-hidden { color: transparent; background: #F2EFE9; border-radius: 4px; user-select: none; }

  .show-match-btn { display: block; padding: 9px 14px; background: transparent; border: 1.5px solid #E7E5E0; border-radius: 8px; font-size: 12px; font-family: inherit; cursor: pointer; color: #78716C; margin-top: 12px; transition: all 0.18s; }
  .show-match-btn:hover { border-color: #059669; color: #059669; }

  .speaking-item { background: #fff; border-radius: 12px; padding: 14px 16px; margin-bottom: 9px; display: flex; gap: 11px; align-items: flex-start; }
  .q-badge { flex-shrink: 0; font-size: 11px; font-weight: 700; color: #fff; background: #059669; border-radius: 6px; padding: 3px 8px; margin-top: 1px; }
  .q-text { font-size: 14px; line-height: 1.65; color: #1C1917; }
`;

export default function Script2Study() {
  const [screen, setScreen] = useState("input");
  const [script, setScript] = useState("");
  const [title, setTitle] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("sentences");
  const [partIdx, setPartIdx] = useState(0);
  const [reveals, setReveals] = useState({});
  const [showMatch, setShowMatch] = useState(false);

  const reveal = (key) => setReveals(p => ({ ...p, [key]: true }));

  const handleGenerate = async () => {
    if (!script.trim()) { setError("영어 스크립트를 먼저 붙여넣어 주세요."); return; }
    setScreen("loading");
    setError("");
    setReveals({});
    setShowMatch(false);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ script, title })
      });
      if (!res.ok) throw new Error("API error");
      const parsed = await res.json();
      setResult(parsed);
      setPartIdx(0);
      setTab("sentences");
      setScreen("result");
    } catch (e) {
      setError("생성 중 오류가 발생했어요. 다시 시도해주세요.");
      setScreen("input");
    }
  };

  if (screen === "loading") return (
    <>
      <Head><title>Script2Study — 교재 생성 중</title></Head>
      <style jsx global>{STYLES}</style>
      <div className="app">
        <div className="loading-screen">
          <div className="spinner" />
          <div className="loading-title">교재 만드는 중...</div>
          <div className="loading-sub">AI가 스크립트를 분석하고 교재를 구성하고 있어요</div>
        </div>
      </div>
    </>
  );

  if (screen === "result" && result) {
    const parts = result.parts || [];
    const part = parts[partIdx] || {};
    const hasParts = parts.length > 1;
    const tabs = [
      { id: "sentences", label: "📖 문장별 해석" },
      { id: "expressions", label: "💡 핵심 표현" },
      { id: "memory", label: "🧠 암기장" },
      { id: "shadowing", label: "🎙 쉐도잉" },
      { id: "workbook", label: "✏️ 워크북" },
    ];

    return (
      <>
        <Head><title>{result.title} — Script2Study</title></Head>
        <style jsx global>{STYLES}</style>
        <div className="app">
          <div className="result-screen">
            <div className="result-header">
              <div className="header-left">
                <div className="header-brand">Script<span>2</span>Study</div>
                <div className="header-doc-title">{result.title}</div>
              </div>
              <button className="btn-back" onClick={() => { setScreen("input"); setResult(null); }}>← 새 교재</button>
            </div>

            <div className="tab-bar">
              {tabs.map(t => (
                <button key={t.id} className={`tab-btn ${tab === t.id ? "active" : ""}`} onClick={() => setTab(t.id)}>
                  {t.label}
                </button>
              ))}
            </div>

            <div className="content-area">
              {hasParts && ["sentences", "expressions"].includes(tab) && (
                <div className="part-selector">
                  {parts.map((p, i) => (
                    <button key={i} className={`part-pill ${partIdx === i ? "active" : ""}`} onClick={() => setPartIdx(i)}>
                      {p.partTitle || `Part ${i + 1}`}
                    </button>
                  ))}
                </div>
              )}

              {tab === "sentences" && (
                <>
                  <div className="sentence-list">
                    {(part.sentences || []).map((s, i) => (
                      <div key={i} className="sentence-pair">
                        <div className="sentence-en">{s.en}</div>
                        <div className="sentence-ko">{s.ko}</div>
                      </div>
                    ))}
                  </div>
                  {part.shadowingSentences?.length > 0 && (
                    <div className="sec-card" style={{ marginTop: 22 }}>
                      <div className="sec-card-title">🎙 이 파트 쉐도잉 문장</div>
                      {part.shadowingSentences.map((s, i) => <div key={i} className="shadow-sent">{s}</div>)}
                    </div>
                  )}
                  {part.learningPoints && (
                    <div className="sec-card">
                      <div className="sec-card-title">📌 학습 포인트</div>
                      <div className="learning-box">{part.learningPoints}</div>
                    </div>
                  )}
                </>
              )}

              {tab === "expressions" && (
                <>
                  <div className="sec-card">
                    <div className="sec-card-title">💡 핵심 표현</div>
                    {(part.keyExpressions || []).map((e, i) => (
                      <div key={i} className="expr-item">
                        <div className="expr-top">
                          <span className="expr-text">{e.expression}</span>
                          {e.star && <span>⭐</span>}
                        </div>
                        <div className="expr-meaning">{e.meaning}</div>
                        <div className="expr-example">예) {e.example}</div>
                      </div>
                    ))}
                  </div>
                  {(part.conversationPoints || []).length > 0 && (
                    <div className="sec-card">
                      <div className="sec-card-title">💬 회화 포인트</div>
                      {part.conversationPoints.map((c, i) => <div key={i} className="conv-item">{c}</div>)}
                    </div>
                  )}
                </>
              )}

              {tab === "memory" && (
                <>
                  <div className="memory-intro">회화에서 바로 꺼낼 수 있는 표현만 모았어요 📌</div>
                  <div className="memory-grid">
                    {(result.memoryCards || []).map((m, i) => (
                      <div key={i} className="mem-card">
                        <div className="mem-expr">{m.expression}</div>
                        <div className="mem-meaning">{m.meaning}</div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {tab === "shadowing" && (
                <>
                  <div className="shadow-intro">Day 1부터 순서대로, 소리 내서 따라 말해보세요 🎙</div>
                  {(result.shadowingTraining || []).map((day, i) => (
                    <div key={i} className="day-card">
                      <div className="day-label">Day {day.day}</div>
                      {(day.sentences || []).map((s, j) => (
                        <div key={j} className="day-sent">
                          <span className="sent-idx">{j + 1}</span>
                          <span>{s}</span>
                        </div>
                      ))}
                    </div>
                  ))}
                </>
              )}

              {tab === "workbook" && (
                <>
                  <div className="wb-section-label">1. 빈칸 채우기</div>
                  {(result.workbook?.fillInBlank || []).map((q, i) => (
                    <div key={i} className="wb-item">
                      <div className="wb-q">{i + 1}. {q.question}</div>
                      {reveals[`fill-${i}`]
                        ? <div className="wb-answer">정답: {q.answer}</div>
                        : <button className="wb-reveal" onClick={() => reveal(`fill-${i}`)}>정답 보기</button>}
                    </div>
                  ))}

                  <div className="wb-section-label">2. 표현 매칭</div>
                  <div className="wb-item">
                    <table className="match-table">
                      <thead><tr><th>표현</th><th>뜻</th></tr></thead>
                      <tbody>
                        {(result.workbook?.matching || []).map((m, i) => (
                          <tr key={i}>
                            <td>{m.expression}</td>
                            <td className={showMatch ? "" : "match-hidden"}>{m.meaning}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <button className="show-match-btn" onClick={() => setShowMatch(p => !p)}>
                      {showMatch ? "뜻 숨기기" : "뜻 보기"}
                    </button>
                  </div>

                  <div className="wb-section-label">3. 한→영 영작</div>
                  {(result.workbook?.translation || []).map((t, i) => (
                    <div key={i} className="wb-item">
                      <div className="wb-q">{i + 1}. {t.korean}</div>
                      {reveals[`trans-${i}`]
                        ? <div className="wb-answer">{t.english}</div>
                        : <button className="wb-reveal" onClick={() => reveal(`trans-${i}`)}>정답 보기</button>}
                    </div>
                  ))}

                  <div className="wb-section-label">4. 스스로 말해보기</div>
                  {(result.workbook?.speakingQuestions || []).map((q, i) => (
                    <div key={i} className="speaking-item">
                      <span className="q-badge">Q{i + 1}</span>
                      <span className="q-text">{q}</span>
                    </div>
                  ))}
                  <div style={{ height: 20 }} />
                </>
              )}
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head><title>Script2Study — 영어 교재 자동 생성기</title></Head>
      <style jsx global>{STYLES}</style>
      <div className="app">
        <div className="input-screen">
          <div className="input-card">
            <div className="brand-row">
              <div className="brand-logo">Script<span>2</span>Study</div>
              <div className="brand-desc">영어 스크립트를 붙여넣으면 완성형 학습 교재를 자동으로 만들어 드려요</div>
            </div>
            <div className="field-group">
              <label className="field-label">콘텐츠 제목 (선택)</label>
              <input className="input-title" type="text" placeholder="예: Hey Tablo EP.1 — MBTI는 옛말?" value={title} onChange={e => setTitle(e.target.value)} />
            </div>
            <div className="field-group">
              <label className="field-label">영어 스크립트 *</label>
              <textarea className="input-textarea" placeholder={"여기에 영어 원문을 붙여넣으세요\n팟캐스트, 유튜브, 드라마 대본, 인터뷰 등 모두 OK"} value={script} onChange={e => setScript(e.target.value)} />
              <div className="char-count">{script.length.toLocaleString()}자</div>
            </div>
            <button className="btn-generate" onClick={handleGenerate} disabled={!script.trim()}>
              교재 자동 생성 →
            </button>
            {error && <div className="error-msg">{error}</div>}
            <div className="tip-box">
              💡 <strong>Tip.</strong> 200~1,000자 분량이 가장 잘 나와요. Hey Tablo 에피소드 1~2분 분량 정도가 적당합니다.
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
