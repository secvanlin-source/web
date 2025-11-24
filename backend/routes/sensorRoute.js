import express from "express";
import { handleSensorData } from "../controllers/sensorController.js";

const router = express.Router();

router.post("/data", handleSensorData);

export default router;
