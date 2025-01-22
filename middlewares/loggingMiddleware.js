// Log information about incoming calls
const loggingMiddleware = (req, res, next) => {
  const { method, originalUrl } = req;
  const logDetails = {
    method,
    url: originalUrl,
    timestamp: new Date().toISOString(),
  };

  console.log(`[${logDetails.timestamp}] ${logDetails.method} ${logDetails.url}`);
  next();
};

module.exports = loggingMiddleware;
