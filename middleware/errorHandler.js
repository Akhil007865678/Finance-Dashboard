module.exports = (err, req, res, next) => {
  console.error("🔥 ERROR OCCURRED");
  console.error("Route:", req.originalUrl);
  console.error("Method:", req.method);
  console.error("Source:", err.source);
  console.error("Message:", err.message);
  console.error("Stack:", err.stack);

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};