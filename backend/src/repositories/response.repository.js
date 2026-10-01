import Response from "../models/Response.js";

class ResponseRepository {

  async createResponse(responseData) {
    return Response.create(responseData);
  }

  async findByFormId(formId) {
    return Response.find({ formId }).sort({ submittedAt: -1 });
  }
  async findById(responseId) {
    return Response.findById(responseId);
  }
  async updateById(responseId, answers) {
    return Response.findByIdAndUpdate(
      responseId,
      { $set: { answers } }, {
      returnDocument: "after",
    }
    );
  }

  async deleteById(responseId) {
    return Response.findByIdAndDelete(responseId);
  }

  async deleteByFormId(formId) {
    return Response.deleteMany({ formId });
  }

}

export default new ResponseRepository();