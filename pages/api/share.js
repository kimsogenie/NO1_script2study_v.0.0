// pages/api/share.js
// 교재 공유 저장(POST) / 불러오기(GET)

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// 짧은 랜덤 ID 생성 (8자리)
function generateId() {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let id = "";
  for (let i = 0; i < 8; i++) {
    id += chars[Math.floor(Math.random() * chars.length)];
  }
  return id;
}

export default async function handler(req, res) {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    return res.status(500).json({ error: "Supabase 환경변수가 설정되지 않았어요." });
  }

  // ── GET: 교재 불러오기 ──
  if (req.method === "GET") {
    const { id } = req.query;
    if (!id) return res.status(400).json({ error: "id가 없어요." });

    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/shared_materials?id=eq.${id}&select=result`,
      {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
        },
      }
    );

    if (!response.ok) return res.status(500).json({ error: "불러오기 실패" });

    const data = await response.json();
    if (!data || data.length === 0) return res.status(404).json({ error: "교재를 찾을 수 없어요." });

    return res.status(200).json({ result: data[0].result });
  }

  // ── POST: 교재 저장 ──
  if (req.method === "POST") {
    const { result } = req.body;
    if (!result) return res.status(400).json({ error: "result가 없어요." });

    const id = generateId();

    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/shared_materials`,
      {
        method: "POST",
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
        body: JSON.stringify({ id, result }),
      }
    );

    if (!response.ok) {
      const err = await response.text();
      console.error("Supabase 저장 오류:", err);
      return res.status(500).json({ error: "저장 실패" });
    }

    return res.status(200).json({ id, shareUrl: `${process.env.NEXT_PUBLIC_APP_URL || "https://no-1-script2study-v-0-0.vercel.app"}/?share=${id}` });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
