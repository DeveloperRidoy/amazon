const error = (err, req, res, next) => {
  const status =
    err.code === 404
      ? 404
        : String(err.code).startsWith("4")
        ? "Fail"
      : "Error";
  
  return res.status(err.code || 500).json({ status, message: err.message || 'Server Error'});
};

module.exports = error;