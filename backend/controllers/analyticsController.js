import orderModel from '../models/orderModel.js'

// Get sales forecast for next month
const getSalesForecast = async (req, res) => {
  try {
    // Get all orders
    const orders = await orderModel.find({})

    // Group by category (assuming products have category)
    // For simplicity, return dummy forecast
    const forecast = [
      { category: 'Electronics', nextMonthSales: 150 },
      { category: 'Clothing', nextMonthSales: 200 },
      { category: 'Books', nextMonthSales: 100 },
      { category: 'Home', nextMonthSales: 80 }
    ]

    res.json({ success: true, forecast })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

export { getSalesForecast }