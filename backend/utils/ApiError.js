class ApiError extends Error {
  constructor(statusCode, message, isOperational = true, stack = "") {
    console.log(message);
    super();
    this.status = false;
    this.statusCode = statusCode;
    this.message = message;
    this.isOperational = isOperational;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

module.exports = ApiError;
