import express from "express";
import cors from "cors";
import sensorRoute from "./routes/sensorRoute.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/sensor", sensorRoute);

app.use((req, res) => {
  res.status(404).json({ message: "Not Found" });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`🔥 Server running at http://localhost:${PORT}`));
