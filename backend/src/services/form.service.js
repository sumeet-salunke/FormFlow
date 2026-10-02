import formRepository from "../repositories/form.repository.js";
import ApiError from "../helpers/ApiError.js";
import { AVAILABILITY_TYPES, FIELD_TYPES, FORM, FORM_STATUS } from "../constants/form.constants.js";
import AUTH from "../constants/auth.constants.js";
import generatePublicId from "../utils/publicId.js";


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

  async updateForm(userId, formId, formData) {
    if (!userId) {
      throw new ApiError(401, AUTH.MESSAGES.UNAUTHORIZED, AUTH.CODES.UNAUTHORIZED);
    }
    if (!formId) {
      throw new ApiError(400, FORM.MESSAGES.FORM_ID_REQUIRED, FORM.CODES.FORM_ID_REQUIRED);
    }
    const form = await formRepository.findById(formId);

    if (!form) {
      throw new ApiError(404, FORM.MESSAGES.FORM_NOT_FOUND, FORM.CODES.FORM_NOT_FOUND);
    }
    if (form.ownerId.toString() !== userId.toString()) {
      throw new ApiError(403, FORM.MESSAGES.FORBIDDEN, FORM.CODES.FORBIDDEN);
    }
    if (form.status !== FORM_STATUS.DRAFT) {
      throw new ApiError(400, FORM.MESSAGES.FORM_NOT_EDITABLE, FORM.CODES.FORM_NOT_EDITABLE);
    }
    const { title, description, availability, fields, startDate, endDate } = formData;
    const updateData = {};
    //Only add properties that were actually supplied. This makes PATCH like PATCH rather than replacing the entire document.
    if (title !== undefined) {
      updateData.title = title.trim();
    }
    if (description !== undefined) {
      updateData.description = description.trim();
    }
    if (availability !== undefined) {
      updateData.availability = availability;
    }
    if (fields !== undefined) {
      updateData.fields = fields;
    }
    //Determine the availaility that should be applied after this PATCH. If the client didn't send availability, use the form's current value.
    const newAvailability = availability !== undefined ? availability : form.availability;
    updateData.availability = newAvailability;

    if (newAvailability === AVAILABILITY_TYPES.ALWAYS) {
      updateData.startDate = null;
      updateData.endDate = null;
    }
    if (newAvailability === AVAILABILITY_TYPES.SCHEDULED
    ) {
      //for scheduled use the newly supplied dates. If a date wasn't supplied in this PATCH, preserve the existing data
      const newStartDate = startDate !== undefined ? startDate : form.startDate;
      const newEndDate = endDate !== undefined ? endDate : form.endDate;
      if (!newStartDate || !newEndDate) {
        throw new ApiError(400, FORM.MESSAGES.CANNOT_UPDATE, FORM.CODES.CANNOT_UPDATE);
      }
      if (new Date(newStartDate) >= new Date(newEndDate)) {
        throw new ApiError(400, FORM.MESSAGES.CANNOT_UPDATE, FORM.CODES.CANNOT_UPDATE);
      }
      updateData.startDate = newStartDate;
      updateData.endDate = newEndDate;
    }

    const updatedForm = await formRepository.updateDraftForm(formId, userId, updateData);

    if (!updatedForm) {
      throw new ApiError(400, FORM.MESSAGES.FORM_NOT_EDITABLE, FORM.CODES.FORM_NOT_EDITABLE);
    }
    return {
      message: FORM.MESSAGES.FORM_UPDATED,
      data: updatedForm,
    }
  }

  async getForm(formId, userId) {
    if (!formId) {
      throw new ApiError(
        400,
        FORM.MESSAGES.FORM_ID_REQUIRED,
        FORM.CODES.FORM_ID_REQUIRED
      );
    }

    if (!userId) {
      throw new ApiError(
        401,
        AUTH.MESSAGES.UNAUTHORIZED,
        AUTH.CODES.UNAUTHORIZED
      );
    }

    const form = await formRepository.findById(formId);

    if (!form) {
      throw new ApiError(
        404,
        FORM.MESSAGES.FORM_NOT_FOUND,
        FORM.CODES.FORM_NOT_FOUND
      );
    }

    // The user can only access their own form.
    if (form.ownerId.toString() !== userId.toString()) {
      throw new ApiError(
        403,
        FORM.MESSAGES.FORBIDDEN,
        FORM.CODES.FORBIDDEN
      );
    }

    return {
      message: FORM.MESSAGES.FORM_FETCHED,
      data: form,
    };
  }

  async publishForm(userId, formId) {
    if (!userId) {
      throw new ApiError(
        401,
        AUTH.MESSAGES.UNAUTHORIZED,
        AUTH.CODES.UNAUTHORIZED
      );
    }

    if (!formId) {
      throw new ApiError(
        400,
        FORM.MESSAGES.FORM_ID_REQUIRED,
        FORM.CODES.FORM_ID_REQUIRED
      );
    }

    const form = await formRepository.findById(formId);

    if (!form) {
      throw new ApiError(
        404,
        FORM.MESSAGES.FORM_NOT_FOUND,
        FORM.CODES.FORM_NOT_FOUND
      );
    }

    if (form.ownerId.toString() !== userId.toString()) {
      throw new ApiError(
        403,
        FORM.MESSAGES.FORBIDDEN,
        FORM.CODES.FORBIDDEN
      );
    }

    if (form.status !== FORM_STATUS.DRAFT) {
      throw new ApiError(
        400,
        FORM.MESSAGES.CANNOT_PUBLISH,
        FORM.CODES.CANNOT_PUBLISH
      );
    }

    if (!form.title || !form.title.trim()) {
      throw new ApiError(
        400,
        FORM.MESSAGES.CANNOT_PUBLISH,
        FORM.CODES.CANNOT_PUBLISH
      );
    }

    if (form.fields.length === 0) {
      throw new ApiError(
        400,
        FORM.MESSAGES.CANNOT_PUBLISH,
        FORM.CODES.CANNOT_PUBLISH
      );
    }

    const validFieldTypes = Object.values(FIELD_TYPES);

    const fieldTypesWithOptions = [
      FIELD_TYPES.MULTIPLE_CHOICE,
      FIELD_TYPES.CHECKBOXES,
      FIELD_TYPES.DROPDOWN,
    ];

    for (const field of form.fields) {
      if (!validFieldTypes.includes(field.type)) {
        throw new ApiError(
          400,
          FORM.MESSAGES.CANNOT_PUBLISH,
          FORM.CODES.CANNOT_PUBLISH
        );
      }

      if (!field.label || !field.label.trim()) {
        throw new ApiError(
          400,
          FORM.MESSAGES.CANNOT_PUBLISH,
          FORM.CODES.CANNOT_PUBLISH
        );
      }

      if (fieldTypesWithOptions.includes(field.type)) {
        if (!field.options || field.options.length === 0) {
          throw new ApiError(
            400,
            FORM.MESSAGES.CANNOT_PUBLISH,
            FORM.CODES.CANNOT_PUBLISH
          );
        }

        for (const option of field.options) {
          if (!option || !option.trim()) {
            throw new ApiError(
              400,
              FORM.MESSAGES.CANNOT_PUBLISH,
              FORM.CODES.CANNOT_PUBLISH
            );
          }
        }
      }
    }

    if (form.availability === AVAILABILITY_TYPES.SCHEDULED) {
      if (!form.startDate || !form.endDate) {
        throw new ApiError(
          400,
          FORM.MESSAGES.CANNOT_PUBLISH,
          FORM.CODES.CANNOT_PUBLISH
        );
      }

      const start = new Date(form.startDate);
      const end = new Date(form.endDate);

      if (isNaN(start.getTime()) || isNaN(end.getTime()) || start >= end) {
        throw new ApiError(
          400,
          FORM.MESSAGES.CANNOT_PUBLISH,
          FORM.CODES.CANNOT_PUBLISH
        );
      }
    }

    const publicId = generatePublicId();

    const publishedForm = await formRepository.publishForm(formId, publicId);

    return {
      message: FORM.MESSAGES.FORM_PUBLISHED
      ,
      data: publishedForm,
    };
  }

  async getPublicForm(publicId) {
    if (!publicId) {
      throw new ApiError(400, FORM.MESSAGES.PUBLICID_REQUIRED, FORM.CODES.PUBLICID_REQUIRED);
    }

    const publicForm = await formRepository.findPublishedFormByPublicId(publicId);

    if (!publicForm) {
      throw new ApiError(404, FORM.MESSAGES.FORM_NOT_FOUND, FORM.CODES.FORM_NOT_FOUND);
    }
    if (publicForm.status !== FORM_STATUS.PUBLISHED) {
      throw new ApiError(400, FORM.MESSAGES.FORM_NOT_PUBLISHED, FORM.CODES.FORM_NOT_PUBLISHED);
    }

    if (publicForm.availability === AVAILABILITY_TYPES.SCHEDULED) {

      const now = new Date();
      if (now < publicForm.startDate) {
        throw new ApiError(403, FORM.MESSAGES.FORM_NOT_AVAILABLE_YET, FORM.CODES.FORM_NOT_AVAILABLE_YET, {
          startDate: publicForm.startDate,
        });
      }
      if (now > publicForm.endDate) {
        throw new ApiError(403, FORM.MESSAGES.FORM_EXPIRED, FORM.CODES.FORM_EXPIRED, {
          endDate: publicForm.endDate,
        })
      }
    }
    return {
      message: FORM.MESSAGES.FORM_FETCHED,
      data: {
        title: publicForm.title,
        description: publicForm.description,
        availability: publicForm.availability,
        fields: publicForm.fields,
        publicId: publicForm.publicId,

      },
    }
  }

  async updateFormStatus(userId, formId, status) {
    if (!userId) {
      throw new ApiError(401, AUTH.MESSAGES.UNAUTHORIZED, AUTH.CODES.UNAUTHORIZED);
    }
    if (!formId) {
      throw new ApiError(400, FORM.MESSAGES.FORM_ID_REQUIRED, FORM.CODES.FORM_ID_REQUIRED);
    }
    if (![FORM_STATUS.PUBLISHED, FORM_STATUS.CLOSED].includes(status)) {
      throw new ApiError(400, FORM.MESSAGES.INVALID_FORM_STATUS, FORM.CODES.INVALID_FORM_STATUS);
    }
    const form = await formRepository.findById(formId);
    if (!form) {
      throw new ApiError(404, FORM.MESSAGES.FORM_NOT_FOUND, FORM.CODES.FORM_NOT_FOUND);
    }
    if (form.ownerId.toString() !== userId.toString()) {
      throw new ApiError(403, FORM.MESSAGES.FORBIDDEN, FORM.CODES.FORBIDDEN);
    }
    const expectedStatus =
      status === FORM_STATUS.CLOSED ? FORM_STATUS.PUBLISHED : FORM_STATUS.CLOSED;

    if (form.status !== expectedStatus) {
      throw new ApiError(
        400,
        FORM.MESSAGES.FORM_STATUS_CHANGE_NOT_ALLOWED,
        FORM.CODES.FORM_STATUS_CHANGE_NOT_ALLOWED
      );
    }

    const updatedForm = await formRepository.updateStatus(formId, userId, expectedStatus, status);
    if (!updatedForm) {
      throw new ApiError(
        400,
        FORM.MESSAGES.FORM_STATUS_CHANGE_NOT_ALLOWED,
        FORM.CODES.FORM_STATUS_CHANGE_NOT_ALLOWED
      );
    }
    const message = status === FORM_STATUS.CLOSED ? FORM.MESSAGES.FORM_HALTED : FORM.MESSAGES.FORM_RESUMED;
    return {
      message,
      data: updatedForm,
    };
  }
}

export default new FormService();