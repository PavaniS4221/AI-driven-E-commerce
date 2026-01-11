// routes/bundleRoutes.js
import express from "express";
import { getBundles } from "../controllers/bundleControllers.js";

const router = express.Router();

// POST /api/bundles/generate
router.post("/generate", getBundles);
console.log("BUNDLE ROUTE HIT")

export default router;
