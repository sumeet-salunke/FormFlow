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

  async updateDraftForm(formId, ownerId, updateData) {
    return Form.findOneAndUpdate({
      _id: formId,
      ownerId,
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

  async updateStatus(formId, ownerId, expectedStatus, newStatus) {
    return Form.findOneAndUpdate(
      {
        _id: formId,
        ownerId,
        status: expectedStatus,
      },
      {
        $set: { status: newStatus },
      },
      {
        returnDocument: "after",
        runValidators: true,
      }
    );
  }

  async deleteByOwnerId(ownerId) {
    return Form.deleteMany({ ownerId });
  }
}

export default new FormRepository();