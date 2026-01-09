import axios from "axios";

export const getSalesPrediction = async (req, res) => {
  try {
    // Try to get prediction from ML service
    console.log("Requesting sales prediction from ML service");
    const response = await axios.get("http://127.0.0.1:8000/predict");
    console.log("Received response from ML service:", response.data);
    res.json(response.data);
  } catch (error) {
    // Fallback to dummy data if ML service is not available
    
    console.log("ML service not available, returning dummy forecast");
    const forecast = [
      { category: 'Electronics', nextMonthSales: 150 },
      { category: 'Clothing', nextMonthSales: 200 },
      { category: 'Books', nextMonthSales: 100 },
      { category: 'Home', nextMonthSales: 80 }
    ];
    res.json({ forecast });
  }
};
