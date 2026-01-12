import mongoose from "mongoose";
import { faker } from "@faker-js/faker";
import userModel from "../models/userModel.js";
import productModel from "../models/productModel.js";
import orderModel from "../models/orderModel.js";

// Connect to MongoDB
mongoose.connect("mongodb+srv://paaani2004_db_user:123abc.S@cluster0.wyi4fit.mongodb.net", {
  
});

// Helper arrays
const paymentMethods = ["Cash on Delivery", "Credit Card", "Debit Card", "UPI", "Wallet"];
const orderStatuses = ["Order Placed", "Shipped", "Delivered", "Cancelled"];

async function generateFakeOrders(count = 300, repeatChance = 0.3) {
  try {
    const users = await userModel.find();
    const products = await productModel.find();

    if (!users.length || !products.length) {
      console.log("❌ Make sure there are users and products in the database first!");
      return;
    }

    const orders = [];

    for (let i = 0; i < count; i++) {
      const user = faker.helpers.arrayElement(users);

      // Decide if this order should repeat some previous purchases
      let orderProducts = [];
      if (Math.random() < repeatChance) {
        // Pick a previous order randomly to copy some products
        const prevOrder = await orderModel.aggregate([{ $sample: { size: 1 } }]);
        if (prevOrder.length && prevOrder[0].items.length) {
          // Take 1-3 items from previous order
          orderProducts = faker.helpers.arrayElements(prevOrder[0].items, faker.number.int({ min: 1, max: Math.min(3, prevOrder[0].items.length) }));
        }
      }
      // If not repeating, pick random products
      if (!orderProducts.length) {
        orderProducts = faker.helpers.arrayElements(products, faker.number.int({ min: 1, max: 5 }));
        // Map to order items format
        orderProducts = orderProducts.map((p) => ({
          productId: p._id.toString(),
          name: p.name,
          price: p.price,
          quantity: faker.number.int({ min: 1, max: 3 })
        }));
      }
const amount = orderProducts.reduce((sum, item) => sum + item.price * item.quantity, 0);

      const address = {
        street: faker.location.streetAddress(),
        city: faker.location.city(),
        state: faker.location.state(),
        zip: faker.location.zipCode(),
        country: faker.location.country()
      };

      orders.push({
        userId: user._id.toString(),
        items: orderProducts,
        amount,
        address,
        status: faker.helpers.arrayElement(orderStatuses),
        paymentMethod: faker.helpers.arrayElement(paymentMethods),
        payment: faker.datatype.boolean(),
        date: faker.date.recent(60).getTime()
      });
    }
    await orderModel.insertMany(orders);
    console.log(`✅ Inserted ${orders.length} fake orders with repeated purchases!`);
  } catch (err) {
    console.error(err);
  }
}

// Repeat insertion multiple times
async function repeatInsertion(times = 5, perBatch = 300) {
  for (let i = 0; i < times; i++) {
    console.log(`\n🚀 Inserting batch ${i + 1}/${times}`);
    await generateFakeOrders(perBatch, 0.3); // 30% chance of repeated products
  }
  mongoose.disconnect();
}

// Run 5 batches of 300 orders (total 1500 orders)
repeatInsertion(5, 300);