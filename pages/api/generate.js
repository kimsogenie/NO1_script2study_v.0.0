import Anthropic from "@anthropic-ai/sdk";

const SYSTEM_PROMPT = `당신은 영어 회화 교재 제작 전문가입니다. 아래 JSON 형식으로만 응답하세요. 순수 JSON만 반환하고 마크다운 코드블록이나 설명을 절대 포함하지 마세요.

{
  "title": "교재 제목",
  "parts": [
    {
      "partNumber": 1,
      "partTitle": "Part 1: 제목",
      "sentences": [{"en": "English sentence.", "ko": "한국어 해석."}],
      "keyExpressions": [
        {
          "expression": "hang out with",
          "meaning": "~와 어울리다",
          "example": "I hung out with friends.",
          "star": true,
          "alternatives": ["spend time with", "chill with"],
          "examTags": ["토스", "오픽"]
        }
      ],
      "conversationPoints": ["회화 포인트 설명"],
      "shadowingSentences": ["shadowing sentence"],
      "learningPoints": "핵심 요약 1~2줄"
    }
  ],
  "memoryCards": [{"expression": "not going to fly", "meaning": "안 통하다", "alternatives": ["won't work", "won't cut it"], "examTags": ["토익"]}],
  "shadowingTraining": [
    {"partNumber": 1, "partTitle": "Part 1: 제목", "sentences": ["s1","s2","s3","s4","s5","s6","s7","s8","s9","s10"]}
  ],
  "workbook": {
    "fillInBlank": [{"question": "빈칸 문제", "answer": "정답"}],
    "matching": [{"expression": "표현", "meaning": "뜻"}],
    "translation": [{"korean": "한국어", "english": "English"}],
    "speakingQuestions": ["말하기 질문"]
  }
}

examTags 규칙 (반드시 지킬 것):
- 각 keyExpression과 memoryCard마다 examTags 배열을 반드시 포함할 것
- 해당 표현이 실제로 자주 출제되거나 사용되는 시험/상황에만 태그 붙이기
- 사용 가능한 태그: "토익", "토스", "오픽", "수능"
- 해당 없으면 빈 배열 [] 로 두기
- 판단 기준:
  • 토익: 비즈니스/일상 문어체, Part 5~7 어휘/독해에 자주 등장하는 표현
  • 토스: 짧고 자연스러운 구어체, 실생활 대화에서 바로 쓸 수 있는 표현
  • 오픽: 경험 묘사, 의견 표현, 스토리텔링에 유용한 표현
  • 수능: 독해/듣기 지문에 자주 나오는 표현

기타 규칙:
- parts: 2~4개
- keyExpressions: 파트당 5개
- shadowingSentences: 파트당 5개
- conversationPoints: 파트당 3개
- shadowingTraining: parts와 동일한 구조로 파트별 구성, 파트당 10문장
- workbook 각 섹션 5개씩
- JSON 반드시 완전하게 닫을 것`;

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { script, title } = req.body;
  if (!script) return res.status(400).json({ error: "스크립트가 없어요." });

  const trimmed = script.length > 10000 ? script.slice(0, 10000) + "\n...(이후 생략)" : script;
  const model = trimmed.length > 3000 ? "claude-sonnet-4-20250514" : "claude-haiku-4-5-20251001";

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  try {
    const message = await client.messages.create({
      model,
      max_tokens: 8096,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: `제목: ${title || "영어 회화 교재"}\n\n스크립트:\n${trimmed}` }]
    });

    const raw = message.content?.[0]?.text || "";
    let cleaned = raw.replace(/```json\n?|\n?```/g, "").trim();

    if (!cleaned.endsWith("}")) {
      let depth = 0, lastValidEnd = -1;
      for (let i = 0; i < cleaned.length; i++) {
        if (cleaned[i] === "{") depth++;
        if (cleaned[i] === "}") { depth--; if (depth === 0) lastValidEnd = i; }
      }
      if (lastValidEnd > 0) cleaned = cleaned.substring(0, lastValidEnd + 1);
    }

    try {
      res.status(200).json(JSON.parse(cleaned));
    } catch {
      res.status(500).json({ error: "교재 형식 오류예요. 스크립트를 조금 줄여서 다시 시도해주세요." });
    }
  } catch (e) {
    const msg = e?.error?.error?.message || e?.message || "";
    if (msg.includes("credit")) return res.status(402).json({ error: "API 크레딧이 부족해요." });
    res.status(500).json({ error: "오류가 발생했어요. 다시 시도해주세요." });
  }
}
