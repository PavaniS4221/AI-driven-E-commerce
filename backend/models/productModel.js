import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: Array, required: true },
    category: { type: String, required: true },
    subCategory: { type: String, required: true },
    sizes: { type: Array, required: true },
    bestseller: { type: Boolean },
    date: { type: Number, required: true },
    event: {
        type: [String],
        enum: ["party", "casual", "wedding", "office", "festival"],
        required: true
      },
      
      bundleCategory: {
        type: String,
        enum: ["top", "bottom", "footwear", "accessory"],
        required: true
      },
      
      tags: {
        type: [String],
        default: []
      },
      
      color: {
        type: String
      },
      
      material: {
        type: String
      }
      
})

const productModel  = mongoose.models.product || mongoose.model("product",productSchema);

export default productModel