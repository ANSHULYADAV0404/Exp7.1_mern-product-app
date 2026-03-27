export const validateProductPayload = (req, res, next) => {
  const { name, category, price, rating, stock, description, image } = req.body;

  if (req.method !== "POST" || req.path !== "/api/products") {
    return next();
  }

  if (
    typeof name !== "string" ||
    typeof category !== "string" ||
    Number.isNaN(Number(price)) ||
    Number.isNaN(Number(rating)) ||
    Number.isNaN(Number(stock))
  ) {
    return res.status(400).json({
      success: false,
      message: "Invalid product payload"
    });
  }

  if (description && typeof description !== "string") {
    return res.status(400).json({
      success: false,
      message: "Description must be a string"
    });
  }

  if (image && typeof image !== "string") {
    return res.status(400).json({
      success: false,
      message: "Image must be a string URL"
    });
  }

  req.body.price = Number(price);
  req.body.rating = Number(rating);
  req.body.stock = Number(stock);

  return next();
};
