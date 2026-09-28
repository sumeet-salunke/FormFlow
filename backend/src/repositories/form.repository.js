import Form from "../models/Form.js";

class FormRepository {

  async create(formData) {
    return Form.create(formData);
  }

  async findById(formId) {
    return Form.findById(formId);

  }

  async findOwnerById(ownerId) {
    return Form.find({
      ownerId
    });
  }

}

export default new FormRepository();