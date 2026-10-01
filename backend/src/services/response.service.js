import { response } from "express";
import { AVAILABILITY_TYPES, FIELD_TYPES, FORM_STATUS } from "../constants/form.constants.js";
import { RESPONSE } from "../constants/response.constants.js";
import ApiError from "../helpers/ApiError.js";
import formRepository from "../repositories/form.repository.js";
import responseRepository from "../repositories/response.repository.js";
import mongoose from "mongoose";

class ResponseService {
  validateAnswers(form, answers) {
    //check for fields that don't exists in the form
    const submittedFields = Object.keys(answers);

    const hasUnknownField = submittedFields.some((fieldId) => {
      return !form.fields.some((field) => {
        return field._id.toString() === fieldId;
      });
    });

    if (hasUnknownField) {
      throw new ApiError(
        400,
        RESPONSE.MESSAGES.UNABLE_TO_SUBMIT,
        RESPONSE.CODES.UNABLE_TO_SUBMIT
      );
    }

    // Check that every required field has a non-empty answer
    const hasMissingRequiredField = form.fields.some((field) => {
      if (!field.required) {
        return false;
      }

      const value = answers[field._id.toString()];

      return (
        value === undefined ||
        value === null ||
        (typeof value === "string" && value.trim() === "") ||
        (Array.isArray(value) && value.length === 0)
      );
    });

    if (hasMissingRequiredField) {
      throw new ApiError(
        400,
        RESPONSE.MESSAGES.UNABLE_TO_SUBMIT,
        RESPONSE.CODES.UNABLE_TO_SUBMIT
      );
    }
    const validFieldTypes = Object.values(FIELD_TYPES);
    const hasInValidFieldType = form.fields.some((field) => {
      return !validFieldTypes.includes(field.type);
    })
    if (hasInValidFieldType) {
      throw new ApiError(400, RESPONSE.MESSAGES.UNABLE_TO_SUBMIT, RESPONSE.CODES.UNABLE_TO_SUBMIT);
    }

    const hasInvalidValue = form.fields.some((field) => {
      const value = answers[field._id.toString()];
      //optional field with no answer is valid
      if (!field.required && (value === undefined || value === null)) {
        return false;
      }

      switch (field.type) {
        case FIELD_TYPES.SHORT_ANSWER:

        case FIELD_TYPES.PARAGRAPH:
          return typeof value !== "string";

        case FIELD_TYPES.NUMBER:
          return typeof value !== "number" || Number.isNaN(value);

        case FIELD_TYPES.EMAIL:
          return (
            typeof value !== "string" ||
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
          );

        case FIELD_TYPES.DATE:
          return (
            typeof value !== "string" ||
            Number.isNaN(Date.parse(value))
          )

        case FIELD_TYPES.MULTIPLE_CHOICE:
        case FIELD_TYPES.DROPDOWN:
          return (
            typeof value !== "string" ||
            !field.options.includes(value)
          );
        case FIELD_TYPES.CHECKBOXES:
          return (
            !Array.isArray(value) ||
            !value.every((selectedValue) =>
              field.options.includes(selectedValue))
          );

        default: return false;
      }
    });
    if (hasInvalidValue) {
      throw new ApiError(400, RESPONSE.MESSAGES.UNABLE_TO_SUBMIT, RESPONSE.CODES.UNABLE_TO_SUBMIT);
    }

  }

  async getResponse(userId, responseId) {

    if (!userId) {
      throw new ApiError(401, RESPONSE.MESSAGES.UNAUTHORIZED, RESPONSE.CODES.UNAUTHORIZED);
    }
    if (!responseId) {
      throw new ApiError(400, RESPONSE.MESSAGES.RESPONSEID_REQUIRED, RESPONSE.CODES.RESPONSEID_REQUIRED);
    }
    const response = await responseRepository.findById(responseId);
    if (!response) {
      throw new ApiError(404, RESPONSE.MESSAGES.RESPONSE_NOT_FOUND, RESPONSE.CODES.RESPONSE_NOT_FOUND);
    }


    const form = await formRepository.findById(response.formId);
    if (!form) {
      throw new ApiError(404, RESPONSE.MESSAGES.FORM_NOT_FOUND, RESPONSE.CODES.FORM_NOT_FOUND);
    }
    if (form.ownerId.toString() !== userId.toString()) {
      throw new ApiError(403, RESPONSE.MESSAGES.FORBIDDEN, RESPONSE.CODES.FORBIDDEN);
    }
    return {
      message: RESPONSE.MESSAGES.RESPONSES_FETCHED,
      data: response,
    };
  }

  async submitResponse(publicId, answers) {
    if (!publicId) {
      throw new ApiError(
        400,
        RESPONSE.MESSAGES.PUBLICID_REQUIRED,
        RESPONSE.CODES.PUBLICID_REQUIRED
      );
    }
    if (
      !answers ||
      typeof answers !== "object" ||
      Array.isArray(answers)
    ) {
      throw new ApiError(
        400,
        RESPONSE.MESSAGES.UNABLE_TO_SUBMIT,
        RESPONSE.CODES.UNABLE_TO_SUBMIT
      );
    }
    const form = await formRepository.findPublishedFormByPublicId(publicId);

    if (!form) {
      throw new ApiError(
        404,
        RESPONSE.MESSAGES.FORM_NOT_FOUND,
        RESPONSE.CODES.FORM_NOT_FOUND
      );
    }

    if (form.status !== FORM_STATUS.PUBLISHED) {
      throw new ApiError(
        400,
        RESPONSE.MESSAGES.FORM_NOT_PUBLISHED,
        RESPONSE.CODES.FORM_NOT_PUBLISHED
      );
    }

    if (form.availability === AVAILABILITY_TYPES.SCHEDULED) {
      const now = new Date();

      if (now < form.startDate) {
        throw new ApiError(
          403,
          RESPONSE.MESSAGES.FORM_NOT_AVAILABLE_YET,
          RESPONSE.CODES.FORM_NOT_AVAILABLE_YET
        );
      }

      if (now > form.endDate) {
        throw new ApiError(
          403,
          RESPONSE.MESSAGES.FORM_EXPIRED,
          RESPONSE.CODES.FORM_EXPIRED
        );
      }
    }

    // validate answers against the form defination
    this.validateAnswers(form, answers);


    const responseAnswers = Object.entries(answers).map(
      ([fieldId, value]) => {
        return {
          fieldId, value,
        };
      }
    );
    const responseData = {
      formId: form._id,
      answers: responseAnswers,
      submittedAt: new Date()
    };
    await responseRepository.createResponse(responseData);

    return {
      message: RESPONSE.MESSAGES.RESPONSE_SUBMITTED,
      data: null,
    }
  }
  async updateResponse(userId, responseId, answers) {
    if (!userId) {
      throw new ApiError(
        401,
        RESPONSE.MESSAGES.UNAUTHORIZED,
        RESPONSE.CODES.UNAUTHORIZED
      );
    }

    if (!responseId) {
      throw new ApiError(
        400,
        RESPONSE.MESSAGES.RESPONSEID_REQUIRED,
        RESPONSE.CODES.RESPONSEID_REQUIRED
      );
    }

    if (
      !answers ||
      typeof answers !== "object" ||
      Array.isArray(answers)
    ) {
      throw new ApiError(
        400,
        RESPONSE.MESSAGES.UNABLE_TO_SUBMIT,
        RESPONSE.CODES.UNABLE_TO_SUBMIT
      );
    }

    // Find the response
    const response = await responseRepository.findById(responseId);

    if (!response) {
      throw new ApiError(
        404,
        RESPONSE.MESSAGES.RESPONSE_NOT_FOUND,
        RESPONSE.CODES.RESPONSE_NOT_FOUND
      );
    }

    // Find the form associated with the response
    const form = await formRepository.findById(response.formId);

    if (!form) {
      throw new ApiError(
        404,
        RESPONSE.MESSAGES.FORM_NOT_FOUND,
        RESPONSE.CODES.FORM_NOT_FOUND
      );
    }

    // Only the form owner can edit its responses
    if (form.ownerId.toString() !== userId.toString()) {
      throw new ApiError(
        403,
        RESPONSE.MESSAGES.FORBIDDEN,
        RESPONSE.CODES.FORBIDDEN
      );
    }

    // Reuse the same validation used during submission
    this.validateAnswers(form, answers);

    // Convert answers object into database format
    const updatedAnswers = Object.entries(answers).map(
      ([fieldId, value]) => {
        return {
          fieldId,
          value,
        };
      }
    );

    const updatedResponse = await responseRepository.updateById(
      responseId,
      updatedAnswers
    );

    return {
      message: RESPONSE.MESSAGES.RESPONSE_UPDATED,
      data: updatedResponse,
    };
  }

  async getFormResponses(userId, formId) {
    if (!userId) {
      throw new ApiError(401, RESPONSE.MESSAGES.UNAUTHORIZED, RESPONSE.CODES.UNAUTHORIZED);
    }
    if (!formId) {
      throw new ApiError(400, RESPONSE.MESSAGES.FORMID_REQUIRED, RESPONSE.CODES.FORMID_REQUIRED);
    }
    const form = await formRepository.findById(formId);
    if (!form) {
      throw new ApiError(404, RESPONSE.MESSAGES.FORM_NOT_FOUND, RESPONSE.CODES.FORM_NOT_FOUND);
    }
    if (form.ownerId.toString() !== userId.toString()) {
      throw new ApiError(403, RESPONSE.MESSAGES.FORBIDDEN, RESPONSE.CODES.FORBIDDEN
      );
    }
    const responses = await responseRepository.findByFormId(formId);

    return {
      message: RESPONSE.MESSAGES.RESPONSES_FETCHED,
      data: responses,
    }
  }

  async deleteResponse(userId, responseId) {
    if (!userId) {
      throw new ApiError(401, RESPONSE.MESSAGES.UNAUTHORIZED, RESPONSE.CODES.UNAUTHORIZED);

    }
    if (!responseId) {
      throw new ApiError(400, RESPONSE.MESSAGES.RESPONSEID_REQUIRED, RESPONSE.CODES.RESPONSEID_REQUIRED);
    }
    const response = await responseRepository.findById(responseId);

    if (!response) {
      throw new ApiError(404, RESPONSE.MESSAGES.RESPONSE_NOT_FOUND, RESPONSE.CODES.RESPONSE_NOT_FOUND);
    }
    const form = await formRepository.findById(response.formId);
    if (form.ownerId.toString() !== userId.toString()) {
      throw new ApiError(403, RESPONSE.MESSAGES.FORBIDDEN, RESPONSE.CODES.FORBIDDEN
      );
    }
    await responseRepository.deleteById(responseId);

    return {
      message: RESPONSE.MESSAGES.RESPOSNE_DELETED,
      data: null,
    }
  }

  async deleteAllResponses(userId, formId) {
    if (!userId) {
      throw new ApiError(401, RESPONSE.MESSAGES.UNAUTHORIZED, RESPONSE.CODES.UNAUTHORIZED);

    }
    if (!formId) {
      throw new ApiError(400, RESPONSE.MESSAGES.FORMID_REQUIRED, RESPONSE.CODES.FORMID_REQUIRED);
    }
    const form = await formRepository.findById(formId);

    if (!form) {
      throw new ApiError(404, RESPONSE.MESSAGES.FORM_NOT_FOUND, RESPONSE.CODES.FORM_NOT_FOUND);
    }

    if (form.ownerId.toString() !== userId.toString()) {
      throw new ApiError(403, RESPONSE.MESSAGES.FORBIDDEN, RESPONSE.CODES.FORBIDDEN
      );
    }
    await responseRepository.deleteByFormId(formId);

    return {
      message: RESPONSE.MESSAGES.ALL_RESPOSNE_DELETED,
      data: null,
    }
  }
}

export default new ResponseService();