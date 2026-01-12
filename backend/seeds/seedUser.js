import mongoose from "mongoose"
import bcrypt from "bcryptjs"
import { faker } from "@faker-js/faker"
import userModel from "../models/userModel.js"

await mongoose.connect("mongodb+srv://paaani2004_db_user:123abc.S@cluster0.wyi4fit.mongodb.net")

const users = []

for (let i = 0; i < 100; i++) {
  users.push({
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password: await bcrypt.hash("password123", 10),
    cartData: {}
  })
}

await userModel.insertMany(users)
console.log("✅ Fake users created")
process.exit()
