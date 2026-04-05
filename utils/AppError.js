class AppError extends Error {
  constructor(message, statusCode, source = "UNKNOWN") {
    super(message);
    this.statusCode = statusCode;
    this.success = false;
    this.source = source;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;