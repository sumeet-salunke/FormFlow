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

  async publishForm(formId, publicId) {
    return Form.findOneAndUpdate(
      {
        _id: formId,
        status: FORM_STATUS.DRAFT,
      }, {
      $set: {
        status: FORM_STATUS.PUBLISHED,
        publicId,
      }
    }, {
      returnDocument: "after",
      runValidators: true,
    }
    );
  }

  async findPublishedFormByPublicId(publicId) {
    return Form.findOne({ publicId });
  }

  async updateStatus(formId, status) {
    return Form.findByIdAndUpdate(
      formId,
      {
        $set: { status }
      }, {
      returnDocument: "after",
      runValidators: true,
    }
    )
  }
}

export default new FormRepository();