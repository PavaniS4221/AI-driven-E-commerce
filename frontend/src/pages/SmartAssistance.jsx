import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";

const SmartAssistance = () => {
  const { addToCart } = useContext(ShopContext);
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [formData, setFormData] = useState({
    event: "",
    tags: "",
    color: "",
    maxPrice: "",
    n_bundles: 3,
  });

  const [bundles, setBundles] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState({});
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState({}); // Track individual adding states

  // Form input handler
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Size selection handler
  const handleSizeChange = (productId, size) => {
    setSelectedSizes((prev) => ({
      ...prev,
      [productId]: size,
    }));
  };

  // Add individual product to cart
  const handleAddToCart = async (product) => {
    const productId = product._id;
    const size = product.sizes ? selectedSizes[productId] || product.sizes[0] : undefined;

    try {
      setAdding((prev) => ({ ...prev, [productId]: true }));
      await addToCart(productId, size);
      setAdding((prev) => ({ ...prev, [productId]: false }));
      alert(`${product.name} added to cart!`);
    } catch (err) {
      setAdding((prev) => ({ ...prev, [productId]: false }));
      console.error(err);
      alert(`Failed to add ${product.name} to cart`);
    }
  };

  // Generate bundles from backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const currentDate = new Date();
    const recentDate =
      currentDate.getFullYear() * 10000 +
      (currentDate.getMonth() + 1) * 100 +
      currentDate.getDate();

    const payload = {
      event: formData.event,
      tags: formData.tags.split(",").map((t) => t.trim()),
      color: formData.color,
      maxPrice: Number(formData.maxPrice),
      n_bundles: Number(formData.n_bundles),
      recentDate: recentDate,
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
      {bundles.length > 0 &&
        bundles.map((bundle, idx) => (
          <div key={idx} className="bg-gray-50 p-6 rounded-xl shadow mb-10">
            <h2 className="text-xl font-semibold mb-4">Bundle {idx + 1}</h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {Object.keys(bundle).map((cat) => {
                const items = Array.isArray(bundle[cat]) ? bundle[cat] : [bundle[cat]];
                const validItems = items.filter((p) => p && p.name && p.price);

                return validItems.map((product, index) => (
                  <div
                    key={cat + index}
                    className="bg-white rounded-xl shadow hover:shadow-lg transition p-3 flex flex-col items-center"
                  >
                    {product.image?.[0] && (
                      <img
                        src={product.image[0]}
                        alt={product.name}
                        className="h-40 w-full object-cover rounded-lg cursor-pointer hover:scale-105 transition"
                      />
                    )}
                    <h4 className="mt-3 font-medium text-center">{product.name}</h4>
                    <p className="font-semibold mt-1">₹{product.price}</p>

                    {/* -------- SIZE SELECTION -------- */}
                    {product.sizes && product.sizes.length > 0 && (
                      <select
                        value={selectedSizes[product._id] || product.sizes[0]}
                        onChange={(e) => handleSizeChange(product._id, e.target.value)}
                        className="mt-2 border p-2 rounded-lg"
                      >
                        {product.sizes.map((size) => (
                          <option key={size} value={size}>
                            {size}
                          </option>
                        ))}
                      </select>
                    )}

                    {/* Add to cart button for each product */}
                    <button
                      onClick={() =>
          addToCart(
            product._id,
            product.sizes && product.sizes.length > 0
              ? selectedSizes[product._id] || product.sizes[0]
              : null
          )
        }
                      disabled={adding[product._id]}
                      className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                      {adding[product._id] ? "Adding..." : "Add to Cart"}
                    </button>
                  </div>
                ));
              })}
            </div>
          </div>
        ))}
    </div>
  );
};

export default SmartAssistance;
