module.exports = class ApiError extends Error {
    constructor(message, statusCode, bodyError) {
      super(message);
      this.statusCode = statusCode;
      this.bodyError = bodyError;
    }
  
    getResponseBody() {
      return {
        error: `${this.bodyError}`,
      };
    }
  };
  