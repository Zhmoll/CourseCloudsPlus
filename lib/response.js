class Response {
  constructor(code, message, body) {
    this.code = code;
    this.message = message;
    this.body = body;
  }
}

class ResponseError extends Error {
  constructor(code, message) {
    this.code = code;
    this.message = message;
  }
}

exports.Response = Response;
exports.ResponseError = ResponseError;