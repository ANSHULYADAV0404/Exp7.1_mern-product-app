import dotenv from "dotenv";
import Product from "../models/Product.js";
import { connectDatabase } from "../config/db.js";
import { productSeed } from "../data/products.js";

dotenv.config();

const seedProducts = async () => {
  const connected = await connectDatabase();

  if (!connected) {
    console.error("Seeding aborted. Add a valid MONGO_URI in backend/.env first.");
    process.exit(1);
  }

  try {
    await Product.deleteMany();
    await Product.insertMany(productSeed);
    console.log("Products seeded successfully.");
    process.exit(0);
  } catch (error) {
    console.error(`Seeding failed: ${error.message}`);
    process.exit(1);
  }
};

seedProducts();
