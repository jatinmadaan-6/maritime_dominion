function notFound(req, res) { res.status(404).json({ message: "Route not found" }); }
function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || "Unexpected server error" });
}
module.exports = { notFound, errorHandler };
