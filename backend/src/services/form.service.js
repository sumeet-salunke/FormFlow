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



  async getMyForms(userId) {
    if (!userId) {
      throw new ApiError(401, AUTH.MESSAGES.UNAUTHORIZED, AUTH.CODES.UNAUTHORIZED);
    }
    const forms = await formRepository.findOwnerById(userId);
    return {
      message: FORM.MESSAGES.FORM_FETCHED,
      data: forms
    }
  }

}

export default new FormService();