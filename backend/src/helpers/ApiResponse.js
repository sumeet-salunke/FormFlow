class ApiResponse {
  constructor(statusCode, message, data = null, meta = null) {
    this.success = true;
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    if (meta) {
      this.meta = meta;
    }
  }
}

export default ApiResponse;