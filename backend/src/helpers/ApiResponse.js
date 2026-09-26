class ApiResponse {
  constructor(statusCode, data = null, message = "Success", meta = null) {
    this.success = true;
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    if (meta) {
      this.meta = meta;
    }
  }
}

export default ApiResponse;