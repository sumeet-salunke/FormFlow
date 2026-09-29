import { FORM_STATUS } from "../constants/form.constants.js";
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
    }).sort({ createdAt: -1 });
  }

  async updateDraftForm(formId, updateData) {
    return Form.findOneAndUpdate({
      _id: formId,
      status: FORM_STATUS.DRAFT,
    }, {
      $set: updateData,
    }, {
      returnDocument: "after",
      runValidators: true
    });
  }

  async publishForm(formId) {
    return Form.findOneAndUpdate(
      {
        _id: formId,
        status: FORM_STATUS.DRAFT,
      }, {
      $set: {
        status: FORM_STATUS.PUBLISHED,
      }
    }, {
      returnDocument: "after",
      runValidators: true,
    }
    );
  }
}

export default new FormRepository();