import formRepository from "../repositories/form.repository.js";
import ApiError from "../helpers/ApiError.js";
import { FORM } from "../constants/form.constants.js";
import AUTH from "../constants/auth.constants.js";

class FormService {
  async createForm(userId, formData) {
    const { title, description } = formData;

    if (!title || !title.trim()) {
      throw new ApiError(400, FORM.MESSAGES.TITLE_REQUIRED, FORM.CODES.TITLE_REQUIRED);
    }

    const form = await formRepository.create({
      title: title.trim(),
      description: description?.trim() || "",
      ownerId: userId,
    });
    return {
      message: FORM.MESSAGES.FORM_CREATED,
      data: form
    };
  }

  async getForm(formId, userId) {
    if (!formId) {
      throw new ApiError(400, FORM.MESSAGES.FORM_ID_REQUIRED, FORM.CODES.FORM_ID_REQUIRED);
    }
    if (!userId) {
      throw new ApiError(401, AUTH.MESSAGES.UNAUTHORIZED, AUTH.CODES.UNAUTHORIZED);
    }
    const form = await formRepository.findById(formId);
    if (!form) {
      throw new ApiError(404, FORM.MESSAGES.FORM_NOT_FOUND, FORM.CODES.FORM_NOT_FOUND);
    }
    //make sure the user owns the form
    if (form.ownerId.toString() !== userId.toString()) {
      throw new ApiError(403, FORM.MESSAGES.FORBIDDEN, FORM.CODES.FORBIDDEN);
    }
    return {
      message: FORM.MESSAGES.FORM_FETCHED,
      data: form,
    };

  }

}

export default new FormService();