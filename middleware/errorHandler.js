function errorHandler(err, req, res, next) {
  console.error('Unhandled server error:', err);

  const statusCode = err.statusCode || 500;
  const message = statusCode === 500
    ? "We couldn't send that right now. Please try again shortly."
    : (err.message || 'Something went wrong. Please try again.');

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
}

module.exports = errorHandler;
