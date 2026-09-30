import Response from "../models/Response.js";

class ResponseRepository {

  async createResponse(responseData) {
    return Response.create(responseData);
  }

}

export default new ResponseRepository();