class ApiError {
  constructor(statusCode, message, isOperational = true, stack = "") {
    console.log(message);
    this.status = false;
    this.statusCode = statusCode;
    this.message = message;
    this.isOperational = isOperational;
    if (stack) {
      this.stack = stack;
    }
  }
}

module.exports = ApiError;
