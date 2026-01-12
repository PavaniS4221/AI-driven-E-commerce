import mongoose from "mongoose";
import { faker } from "@faker-js/faker";
import productModel from  "../models/productModel.js"; // your model

// Connect to MongoDB
mongoose.connect("mongodb+srv://paaani2004_db_user:123abc.S@cluster0.wyi4fit.mongodb.net", {
  
});

// Helper arrays for enum fields
const events = ["party", "casual", "wedding", "office", "festival"];
const bundleCategories = ["top", "bottom", "footwear", "accessory"];
const colors = ["red", "blue", "green", "black", "white", "yellow", "pink", "purple"];
const materials = ["cotton", "polyester", "leather", "denim", "silk"];

// Function to generate fake products
async function generateFakeProducts(count = 500) {
  const products = [];

  for (let i = 0; i < count; i++) {
    products.push({
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: faker.number.int({ min: 299, max: 4999 }),
      image: [faker.image.urlPicsumPhotos()], // array of images
      category: faker.commerce.department(),
      subCategory: faker.commerce.product(),
      sizes: faker.helpers.arrayElements(["S", "M", "L", "XL", "XXL"], faker.number.int({ min: 1, max: 5 })),
      bestseller: faker.datatype.boolean(),
      date: faker.date.recent().getTime(), // timestamp in ms
      event: faker.helpers.arrayElements(events, faker.number.int({ min: 1, max: 3 })),
      bundleCategory: faker.helpers.arrayElement(bundleCategories),
      tags: faker.helpers.arrayElements(["new", "trending", "sale", "limited", "popular"], faker.number.int({ min: 0, max: 3 })),
      color: faker.helpers.arrayElement(colors),
      material: faker.helpers.arrayElement(materials)
    });
  }

  try {
    await productModel.insertMany(products);
    console.log(`✅ Inserted ${products.length} fake products!`);
  } catch (err) {
    console.error(err);
  } finally {
    mongoose.disconnect();
  }
}

// Run
generateFakeProducts(500); // generate 500 products
