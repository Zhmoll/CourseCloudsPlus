class Response {
  constructor(code, message, body) {
    this.code = code;
    this.message = message;
    this.body = body;
  }
}

class ResponseError extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
  }
}

exports.Response = Response;
exports.ResponseError = ResponseError;