
const ENDPOINT = "http://localhost:3000/api/sensor/data";

const soilInput = document.getElementById("soil");
const tempInput = document.getElementById("temp");
const humidityInput = document.getElementById("humidity");
const sendBtn = document.getElementById("sendBtn");
const onlyRecommendCheckbox = document.getElementById("onlyRecommend");

const statusEl = document.getElementById("status");

const aiArea = document.getElementById("aiArea");
const rawEl = document.getElementById("raw");
function Delay(wait)
{
  return new Promise(resolve=>setTimeout(resolve,wait));
}
function setStatus(text, isError = false) {
  statusEl.textContent = text;
  statusEl.style.color = isError ? "var(--danger)" : "";
}

document.getElementById("randomBtn").addEventListener("click", async() => {
  setStatus("Đang lấy dữ liệu...");
  await Delay(1000);
  soilInput.value = Math.floor(Math.random() * 1+ 52);
  tempInput.value = (Math.random() * 1 + 17).toFixed(1);
  humidityInput.value = Math.floor(Math.random() * 1 + 61); 

  setStatus("Đã đo!");
});

function safeText(s) {
  if (s === null || s === undefined) return "";
  return String(s);
}



function renderMarkdown(mdText) {

  try {
    return marked.parse(mdText || "");
  } catch (e) {
    return `<pre>${mdText}</pre>`;
  }
}

sendBtn.addEventListener("click", async () => {
  const soil = soilInput.value;
  const temp = tempInput.value;
  const humidity = humidityInput.value;


  if (soil === "" || temp === "" || humidity === "") {
    setStatus("Vui lòng nhập đủ 3 giá trị.", true);
    return;
  }

  const payload = {
    soil: Number(soil),
    temp: Number(temp),
    humidity: Number(humidity),
  };

  setStatus("⏳ Đang gửi dữ liệu...");

  
  aiArea.innerHTML = "";
  rawEl.classList.add("hidden");

  try {
    const r = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!r.ok) {
      const errBody = await r.json().catch(()=>({message:r.statusText}));
      setStatus(`Lỗi server: ${errBody.error || r.statusText}`, true);
      rawEl.textContent = JSON.stringify(errBody, null, 2);
      rawEl.classList.remove("hidden");
      return;
    }

    const data = await r.json();


    setStatus("✅ Nhận kết quả từ server");




    const aiRaw = safeText(data.aiRecommend || data.ai || data.aiRecommendText || data.aiRecommendation || data.recommendation || "");


    


    aiArea.innerHTML = renderMarkdown(aiRaw || "*Không có khuyến nghị từ AI.*");

  } catch (err) {
    setStatus("Lỗi kết nối: " + (err.message || err), true);
    rawEl.textContent = String(err.stack || err.message || err);
    rawEl.classList.remove("hidden");
  }
  
});
