import { getAIRecommendation } from "../services/aiService.js";

export const handleSensorData = async (req, res) => {
  try {
    const { soil, temp, humidity } = req.body;

    console.log("🔥 Data received:", req.body);

    if (soil === undefined || temp === undefined || humidity === undefined) {
      return res.status(400).json({
        error: "Thiếu dữ liệu. Yêu cầu soil, temp, humidity"
      });
    }

    const ai = await getAIRecommendation(soil, temp, humidity);

    return res.json({
      status: "OK",
      aiRecommend: ai
    });

  } catch (err) {
    return res.status(500).json({
      error: "Server error",
      detail: err.message
    });
  }
};
