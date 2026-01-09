import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { backendUrl } from '../App'
import SalesForecast from './SalesForcast'

const Dashboard = ({ token }) => {
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [totalRevenue, setTotalRevenue] = useState(0)

  useEffect(() => {
    // Fetch products
    axios.get(`${backendUrl}/api/product/list`).then(res => {
      if (res.data.success) {
        setProducts(res.data.products)
      }
    }).catch(err => console.log(err))

    // Fetch orders
    axios.post(`${backendUrl}/api/order/list`, {}, {
      headers: { token }
    }).then(res => {
      if (res.data.success) {
        setOrders(res.data.orders)
        // Calculate total revenue
        const revenue = res.data.orders.reduce((sum, order) => sum + order.amount, 0)
        setTotalRevenue(revenue)
      }
    }).catch(err => console.log(err))
  }, [token])

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Total Products</h3>
          <p className="text-3xl font-bold text-blue-600">{products.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Total Orders</h3>
          <p className="text-3xl font-bold text-green-600">{orders.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Total Revenue</h3>
          <p className="text-3xl font-bold text-purple-600">${totalRevenue}</p>
        </div>
      </div>

      <SalesForecast token={token} />
    </div>
  )
}

export default Dashboard