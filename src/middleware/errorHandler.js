function notFoundHandler(req, res) {
  res.status(404).json({
    error: 'Route not found'
  });
}

function errorHandler(err, req, res, _next) {
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';

  if (status >= 500) {
    console.error(err);
  }

  res.status(status).json({
    error: message
  });
}

module.exports = {
  notFoundHandler,
  errorHandler
};