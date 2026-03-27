import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDatabase, getDatabaseStatus } from "./config/db.js";
import productRoutes from "./routes/productRoutes.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";
import { validateProductPayload } from "./middleware/validateProduct.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

app.use(
  cors({
    origin: CLIENT_URL
  })
);
app.use(express.json());
app.use(validateProductPayload);

app.get("/api/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "API is running",
    database: getDatabaseStatus() ? "connected" : "mock-fallback"
  });
});

app.get("/api", (_req, res) => {
  res.status(200).json({
    success: true,
    endpoints: {
      health: "/api/health",
      products: "/api/products",
      summary: "/api/products/summary",
      productById: "/api/products/:id"
    }
  });
});

app.use("/api/products", productRoutes);

app.use(notFound);
app.use(errorHandler);

connectDatabase().finally(() => {
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
});
