import Anthropic from "@anthropic-ai/sdk";

const SYSTEM_PROMPT = `당신은 영어 회화 교재 제작 전문가입니다. 아래 JSON 형식으로만 응답하세요. 순수 JSON만 반환하고 마크다운 코드블록이나 설명을 절대 포함하지 마세요.

{
  "title": "교재 제목",
  "parts": [
    {
      "partNumber": 1,
      "partTitle": "Part 1: 제목",
      "sentences": [{"en": "English sentence.", "ko": "한국어 해석."}],
      "keyExpressions": [{"expression": "hang out with", "meaning": "~와 어울리다", "example": "I hung out with friends.", "star": true}],
      "conversationPoints": ["회화 포인트 설명"],
      "shadowingSentences": ["shadowing sentence"],
      "learningPoints": "핵심 요약 1~2줄"
    }
  ],
  "memoryCards": [{"expression": "not going to fly", "meaning": "안 통하다"}],
  "shadowingTraining": [
    {"day": 1, "sentences": ["s1","s2","s3","s4","s5"]}
  ],
  "workbook": {
    "fillInBlank": [{"question": "빈칸 문제", "answer": "정답"}],
    "matching": [{"expression": "표현", "meaning": "뜻"}],
    "translation": [{"korean": "한국어", "english": "English"}],
    "speakingQuestions": ["말하기 질문"]
  }
}

엄격한 규칙 — 반드시 지킬 것:
- parts: 최대 2개만
- keyExpressions: 파트당 4개만
- shadowingSentences: 파트당 4개만
- conversationPoints: 파트당 2개만
- shadowingTraining: Day 1~3만 (3일치)
- workbook 각 섹션 4개씩
- 모든 설명은 짧고 간결하게
- JSON 반드시 완전하게 닫을 것`;

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { script, title } = req.body;
  if (!script) return res.status(400).json({ error: "스크립트가 없어요." });

  // 스크립트 너무 길면 자르기
  const trimmedScript = script.length > 1500 ? script.slice(0, 1500) + "\n...(이후 생략)" : script;

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  try {
    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 8096,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: `제목: ${title || "영어 회화 교재"}\n\n스크립트:\n${trimmedScript}` }]
    });

    const raw = message.content?.[0]?.text || "";
    let cleaned = raw.replace(/```json\n?|\n?```/g, "").trim();

    // JSON 잘린 경우 복구
    if (!cleaned.endsWith("}")) {
      let depth = 0, lastValidEnd = -1;
      for (let i = 0; i < cleaned.length; i++) {
        if (cleaned[i] === "{") depth++;
        if (cleaned[i] === "}") { depth--; if (depth === 0) lastValidEnd = i; }
      }
      if (lastValidEnd > 0) cleaned = cleaned.substring(0, lastValidEnd + 1);
    }

    try {
      const parsed = JSON.parse(cleaned);
      res.status(200).json(parsed);
    } catch {
      res.status(500).json({ error: "교재 형식 오류예요. 스크립트를 더 짧게 줄여서 다시 시도해주세요." });
    }
  } catch (e) {
    const msg = e?.error?.error?.message || e?.message || "";
    if (msg.includes("credit")) return res.status(402).json({ error: "API 크레딧이 부족해요." });
    res.status(500).json({ error: "오류가 발생했어요. 다시 시도해주세요." });
  }
}
