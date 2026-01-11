import { useState } from "react";
import axios from "axios";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

const SmartAssistance = () => {
  const [formData, setFormData] = useState({
    event: "",
    tags: "",
    color: "",
    maxPrice: "",
    n_bundles: 3,
  });

  const [bundles, setBundles] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
   
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
      
    e.preventDefault();
    setLoading(true);

    const payload = {
      event: formData.event,
      tags: formData.tags.split(",").map(t => t.trim()),
      color: formData.color,
      maxPrice: Number(formData.maxPrice),
      n_bundles: Number(formData.n_bundles),
      recentDate: 20260101
    };

    try {
     
      const res = await axios.post(`${backendUrl}/api/bundles/generate`, payload);
      
      setBundles(res.data.bundles);
    } catch (err) {
      alert("Failed to generate bundles");
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-center mb-8">
        Smart Outfit Bundle Generator
      </h1>

      {/* -------- FORM -------- */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-6 rounded-xl shadow-md mb-10"
      >
        <input
          name="event"
          placeholder="Event (casual, party)"
          onChange={handleChange}
          className="border p-3 rounded-lg"
        />

        <input
          name="tags"
          placeholder="Tags (summer, cotton)"
          onChange={handleChange}
          className="border p-3 rounded-lg"
        />

        <input
          name="color"
          placeholder="Preferred Color"
          onChange={handleChange}
          className="border p-3 rounded-lg"
        />

        <input
          name="maxPrice"
          type="number"
          placeholder="Max Budget"
          onChange={handleChange}
          className="border p-3 rounded-lg"
        />

        <input
          name="n_bundles"
          type="number"
          value={formData.n_bundles}
          onChange={handleChange}
          className="border p-3 rounded-lg"
        />

        <button
          type="submit"
          className="bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition col-span-1 md:col-span-3 py-3"
        >
          {loading ? "Generating..." : "Generate Bundles"}
        </button>
      </form>

      {/* -------- BUNDLES -------- */}
      {bundles.length > 0 && (
  <div className="space-y-12">
    {bundles.map((bundle, idx) => (
      <div key={idx} className="bg-gray-50 p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">Bundle {idx + 1}</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {Object.keys(bundle).map((cat) => {
            const product = bundle[cat];

            return (
              <div
                key={cat}
                className="bg-white rounded-xl shadow hover:shadow-lg transition p-3 flex flex-col items-center"
              >
                {/* Image */}
                {product.image && product.image[0] && (
                  <img
                    src={product.image[0]} // should be full URL from backend
                    alt={product.name}
                    className="h-40 w-full object-cover rounded-lg"
                  />
                )}

                {/* Name */}
                <h4 className="mt-3 font-medium text-center">{product.name}</h4>

                {/* Price */}
                <p className="font-semibold mt-1">₹{product.price}</p>
              </div>
            );
          })}
        </div>
      </div>
    ))}
  </div>
    )}

    </div>
  );
};

export default SmartAssistance;
