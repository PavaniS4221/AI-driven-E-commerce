import { useEffect, useState } from "react"
import axios from "axios"
import { backendUrl } from "../App"

const SalesForecast = ({ token }) => {
  const [forecast, setForecast] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

 

  useEffect(() => {
     if (!token) return
    const fetchForecast = async () => {
      try {
        const res = await axios.get(
          `${backendUrl}/api/predictions/sales`,
          {
            headers: { token }
          }
        )

        if (res.data.forecast) {
          setForecast(res.data.forecast)
        }
      } catch (err) {
        console.error(err)
        setError("Failed to load sales forecast")
      } finally {
        setLoading(false)
      }
    }

    fetchForecast()
  }, [token])

  

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">
        Sales Forecast (Next 30 Days)
      </h2>

      {loading && <p>Loading forecast...</p>}

      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <table className="border w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="p-2">Date</th>
              <th className="p-2">Predicted Sales</th>
            </tr>
          </thead>
          <tbody>
            {forecast.map((item, index) => (
              <tr key={index} className="border-b">
                <td className="p-2">
                  {new Date(item.ds).toLocaleDateString()}
                </td>
                <td className="p-2 font-semibold">
                  ₹{Math.round(item.yhat)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default SalesForecast
