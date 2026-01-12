// controllers/bundleController.js
import axios from "axios";

export const getBundles = async (req, res) => {
  try {
    console.log("✅ Bundle API hit (Node)");
    console.log("Payload:", req.body);

    // Call FastAPI (Python)
    const response = await axios.post(
      "http://127.0.0.1:8000/generate-bundles",
      req.body,
      
    );

    // Send result back to frontend
    res.json(response.data);
  } catch (error) {
    console.error("❌ Bundle generation failed:", error.message);
    res.status(500).json({
      error: "Failed to generate bundles"
    });
  }
};
