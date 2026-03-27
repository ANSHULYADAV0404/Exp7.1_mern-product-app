import Product from "../models/Product.js";
import { productSeed } from "../data/products.js";
import { getDatabaseStatus } from "../config/db.js";

export const getProducts = async (_req, res, next) => {
  try {
    const usingDatabase = getDatabaseStatus();
    const { category, search, sort = "latest" } = _req.query;

    if (!usingDatabase) {
      let products = [...productSeed];

      if (category) {
        products = products.filter(
          (product) => product.category.toLowerCase() === category.toLowerCase()
        );
      }

      if (search) {
        const searchValue = search.toLowerCase();
        products = products.filter(
          (product) =>
            product.name.toLowerCase().includes(searchValue) ||
            product.description.toLowerCase().includes(searchValue)
        );
      }

      if (sort === "price-asc") {
        products.sort((a, b) => a.price - b.price);
      } else if (sort === "price-desc") {
        products.sort((a, b) => b.price - a.price);
      } else if (sort === "rating-desc") {
        products.sort((a, b) => b.rating - a.rating);
      }

      return res.status(200).json({
        success: true,
        source: "mock",
        count: products.length,
        products
      });
    }

    const query = {};

    if (category) {
      query.category = new RegExp(`^${category}$`, "i");
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ];
    }

    const sortMap = {
      latest: { createdAt: -1 },
      "price-asc": { price: 1 },
      "price-desc": { price: -1 },
      "rating-desc": { rating: -1 }
    };

    const products = await Product.find(query).sort(sortMap[sort] || sortMap.latest);

    return res.status(200).json({
      success: true,
      source: "mongodb",
      count: products.length,
      products
    });
  } catch (error) {
    next(error);
  }
};

export const getProductSummary = async (_req, res, next) => {
  try {
    const usingDatabase = getDatabaseStatus();
    const products = usingDatabase ? await Product.find() : productSeed;

    const totalProducts = products.length;
    const averagePrice =
      totalProducts === 0
        ? 0
        : products.reduce((sum, product) => sum + product.price, 0) / totalProducts;
    const categories = [...new Set(products.map((product) => product.category))];

    return res.status(200).json({
      success: true,
      metrics: {
        totalProducts,
        categories: categories.length,
        averagePrice: Number(averagePrice.toFixed(2)),
        inventoryUnits: products.reduce((sum, product) => sum + product.stock, 0)
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getDashboardData = async (req, res, next) => {
  try {
    const usingDatabase = getDatabaseStatus();
    const { category, search, sort = "latest" } = req.query;

    if (!usingDatabase) {
      let products = [...productSeed];

      if (category) {
        products = products.filter(
          (product) => product.category.toLowerCase() === category.toLowerCase()
        );
      }

      if (search) {
        const searchValue = search.toLowerCase();
        products = products.filter(
          (product) =>
            product.name.toLowerCase().includes(searchValue) ||
            product.description.toLowerCase().includes(searchValue)
        );
      }

      if (sort === "price-asc") {
        products.sort((a, b) => a.price - b.price);
      } else if (sort === "price-desc") {
        products.sort((a, b) => b.price - a.price);
      } else if (sort === "rating-desc") {
        products.sort((a, b) => b.rating - a.rating);
      }

      const categories = [...new Set(products.map((product) => product.category))];
      const averagePrice =
        products.length === 0
          ? 0
          : products.reduce((sum, product) => sum + product.price, 0) / products.length;

      return res.status(200).json({
        success: true,
        source: "mock",
        count: products.length,
        products,
        metrics: {
          totalProducts: products.length,
          categories: categories.length,
          averagePrice: Number(averagePrice.toFixed(2)),
          inventoryUnits: products.reduce((sum, product) => sum + product.stock, 0)
        }
      });
    }

    const query = {};

    if (category) {
      query.category = new RegExp(`^${category}$`, "i");
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ];
    }

    const sortMap = {
      latest: { createdAt: -1 },
      "price-asc": { price: 1 },
      "price-desc": { price: -1 },
      "rating-desc": { rating: -1 }
    };

    const products = await Product.find(query).sort(sortMap[sort] || sortMap.latest);
    const categories = [...new Set(products.map((product) => product.category))];
    const averagePrice =
      products.length === 0
        ? 0
        : products.reduce((sum, product) => sum + product.price, 0) / products.length;

    return res.status(200).json({
      success: true,
      source: "mongodb",
      count: products.length,
      products,
      metrics: {
        totalProducts: products.length,
        categories: categories.length,
        averagePrice: Number(averagePrice.toFixed(2)),
        inventoryUnits: products.reduce((sum, product) => sum + product.stock, 0)
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const usingDatabase = getDatabaseStatus();

    if (!usingDatabase) {
      const product = productSeed.find((item) => item.name === req.params.id);

      if (!product) {
        res.status(404);
        throw new Error("Product not found");
      }

      return res.status(200).json({
        success: true,
        source: "mock",
        product
      });
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }

    return res.status(200).json({
      success: true,
      source: "mongodb",
      product
    });
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (req, res, next) => {
  try {
    if (!getDatabaseStatus()) {
      res.status(503);
      throw new Error("Create operation requires MongoDB connection");
    }

    const { name, category, price, rating, stock, description, image, badge } = req.body;

    if (!name || !category || price === undefined || rating === undefined || stock === undefined) {
      res.status(400);
      throw new Error("Name, category, price, rating, and stock are required");
    }

    const product = await Product.create({
      name,
      category,
      price,
      rating,
      stock,
      description: description || "No description provided.",
      image:
        image ||
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80",
      badge: badge || "Featured"
    });

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      product
    });
  } catch (error) {
    next(error);
  }
};

export const viewProduct = async (req, res, next) => {
  try {
    const usingDatabase = getDatabaseStatus();

    if (!usingDatabase) {
      const product = productSeed.find((item) => item.name === req.params.id);

      if (!product) {
        res.status(404);
        throw new Error("Product not found");
      }

      const relatedProducts = productSeed
        .filter((item) => item.name !== product.name && item.category === product.category)
        .slice(0, 3);

      return res.status(200).json({
        success: true,
        source: "mock",
        message: "Product details loaded successfully",
        product: {
          ...product,
          viewCount: 1,
          lastViewedAt: new Date().toISOString()
        },
        relatedProducts
      });
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        $inc: { viewCount: 1 },
        $set: { lastViewedAt: new Date() }
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }

    const relatedProducts = await Product.find({
      _id: { $ne: product._id },
      category: product.category
    })
      .sort({ rating: -1, viewCount: -1 })
      .limit(3);

    return res.status(200).json({
      success: true,
      source: "mongodb",
      message: "Product interaction recorded",
      product,
      relatedProducts
    });
  } catch (error) {
    next(error);
  }
};
