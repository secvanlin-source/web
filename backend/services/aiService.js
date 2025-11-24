import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

export async function getAIRecommendation(soil, temp, humidity) {
    try {
        const apiKey = process.env.OPENROUTER_API_KEY;
        const model = process.env.OPENROUTER_MODEL || "x-ai/grok-4.1-fast";

        if (!apiKey) {
            console.error("❌ OPENROUTER_API_KEY is missing!");
            return "Lỗi: Thiếu API key";
        }

        const prompt = `
Bạn là hệ thống AI tư vấn nông nghiệp cho khí hậu Việt Nam.
Dữ liệu cảm biến hiện tại:
- Độ ẩm đất: ${soil}%
- Nhiệt độ: ${temp}°C
- Độ ẩm không khí: ${humidity}%

Hãy cung cấp:
1. Cảnh báo nông nghiệp(lưu ý chi tiết ít nhất 2 dòng).
2. Khuyến nghị chi tiết(ít nhất 6 dòng).
3. Gợi ý cây trồng phù hợp(lưu ý đưa ra ít nhất 6-12 cây trồng).
Trình bày rõ ràng, có xuống dòng, sử dụng emoji hợp lý.
        `;

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "HTTP-Referer": "http://localhost:3000",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model,
                messages: [
                    { role: "user", content: prompt }
                ]
            })
        });

        const data = await response.json();

        if (!response.ok) {
            console.log("❌ AI error:", data);
            return `AI lỗi: ${data.error?.message || "Không rõ lỗi"}`;
        }

        return data.choices?.[0]?.message?.content || "AI không trả lời";
    } catch (err) {
        console.error("❌ Lỗi AI:", err.message);
        return "AI hiện không thể tạo khuyến nghị.";
    }
}
