import express from "express";
import { getSalesPrediction } from "../controllers/PredictControllers.js";

const router = express.Router();

router.get("/sales", getSalesPrediction);

export default router;
