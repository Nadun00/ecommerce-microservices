module.exports = (req, res) => {
  res.status(404).json({
    message: `Gateway route not found: ${req.method} ${req.originalUrl}`
  });
};
