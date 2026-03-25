import Anthropic from "@anthropic-ai/sdk";

const SYSTEM_PROMPT = `당신은 영어 회화 교재 제작 전문가입니다. 사용자가 영어 스크립트를 붙여넣으면 반드시 아래 JSON 형식으로만 응답하세요. 순수 JSON만 반환하고 마크다운 코드블록이나 설명을 절대 포함하지 마세요.

{
  "title": "교재 제목",
  "parts": [
    {
      "partNumber": 1,
      "partTitle": "Part 1: 제목",
      "sentences": [{"en": "English sentence.", "ko": "자연스러운 한국어 해석."}],
      "keyExpressions": [{"expression": "hang out with", "meaning": "~와 어울리다, 시간을 보내다", "example": "I hung out with my coworkers after work.", "star": true}],
      "conversationPoints": ["People don't do X anymore. — 요즘 X 안 해, 라는 트렌드 표현으로 아주 자연스럽다."],
      "shadowingSentences": ["I was hanging out with some old friends."],
      "learningPoints": "이번 파트의 핵심 1~3줄 요약"
    }
  ],
  "memoryCards": [{"expression": "not going to fly", "meaning": "안 통하다, 안 먹히다"}],
  "shadowingTraining": [
    {"day": 1, "sentences": ["s1","s2","s3","s4","s5"]},
    {"day": 2, "sentences": ["s1","s2","s3","s4","s5"]},
    {"day": 3, "sentences": ["s1","s2","s3","s4","s5"]},
    {"day": 4, "sentences": ["s1","s2","s3","s4","s5"]},
    {"day": 5, "sentences": ["s1","s2","s3","s4","s5"]}
  ],
  "workbook": {
    "fillInBlank": [{"question": "I was ___ ___ with some old friends. (어울리며 시간을 보내다)", "answer": "hanging out"}],
    "matching": [{"expression": "hang out with", "meaning": "~와 어울리다"}],
    "translation": [{"korean": "요즘 사람들 MBTI 안 해.", "english": "People don't do MBTI anymore."}],
    "speakingQuestions": ["당신은 MBTI와 에니어그램 중 어느 걸 더 믿나요? 영어로 말해보세요."]
  }
}

중요: 응답이 길어지더라도 반드시 JSON을 완전하게 닫아서 완성된 형태로 반환하세요. 잘린 JSON은 절대 안 됩니다.
규칙:
- parts: 내용 흐름 기준 2~3개 섹션으로 나누기 (너무 많이 나누지 말 것)
- keyExpressions: 파트당 5개만 선정
- shadowingTraining: Day 1~5, 하루 5문장
- workbook 각 섹션 5개씩
- 설명은 자연스럽고 말하듯이, 딱딱한 문법 설명 금지`;

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { script, title } = req.body;
  if (!script) return res.status(400).json({ error: "스크립트가 없어요." });

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  try {
    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 8000,
      system: SYSTEM_PROMPT,
      messages: [{
        role: "user",
        content: `제목: ${title || "영어 회화 교재"}\n\n스크립트:\n${script}`
      }]
    });

    const raw = message.content?.[0]?.text || "";
    
    // 마크다운 코드블록 제거
    let cleaned = raw.replace(/```json\n?|\n?```/g, "").trim();
    
    // JSON이 잘렸을 경우 복구 시도
    if (!cleaned.endsWith("}")) {
      // 마지막으로 완전히 닫힌 위치 찾기
      let depth = 0;
      let lastValidEnd = -1;
      for (let i = 0; i < cleaned.length; i++) {
        if (cleaned[i] === "{") depth++;
        if (cleaned[i] === "}") {
          depth--;
          if (depth === 0) lastValidEnd = i;
        }
      }
      if (lastValidEnd > 0) {
        cleaned = cleaned.substring(0, lastValidEnd + 1);
      }
    }

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      console.error("Raw response:", raw.substring(0, 500));
      return res.status(500).json({ error: "교재 형식 오류가 발생했어요. 스크립트를 조금 짧게 줄여서 다시 시도해주세요." });
    }

    res.status(200).json(parsed);
  } catch (e) {
    console.error("API error:", e);
    const msg = e?.error?.error?.message || e?.message || "";
    if (msg.includes("credit")) {
      return res.status(402).json({ error: "API 크레딧이 부족해요. console.anthropic.com에서 충전해주세요." });
    }
    res.status(500).json({ error: "교재 생성 중 오류가 발생했어요. 다시 시도해주세요." });
  }
}
