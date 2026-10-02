import { hashPassword, verifyPassword } from "../utils/password.js";
import userRepository from "../repositories/user.repository.js";
import formRepository from "../repositories/form.repository.js";
import responseRepository from "../repositories/response.repository.js";
import ApiError from "../helpers/ApiError.js";
import AUTH from "../constants/auth.constants.js";



class AuthService {

  async register({ name, email, password }) {
    //Normalize the email before checking for an exisiting account
    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await userRepository.findByEmail(normalizedEmail);

    if (existingUser) {
      throw new ApiError(409, AUTH.MESSAGES.EMAIL_ALREADY_EXISTS,
        AUTH.CODES.EMAIL_ALREADY_EXISTS
      );
    }

    //plain passwords must never be stored in MongoDb
    const passwordHash = await hashPassword(password);

    const user = await userRepository.create({
      name: name.trim(),
      email: normalizedEmail,
      passwordHash
    });
    //never return passwordHash to the controller/client
    return {
      message: AUTH.MESSAGES.USER_REGISTERED,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt
      },
    };
  }

  async login({ email, password }) {
    const normalizedEmail = email.trim().toLowerCase();

    const user = await userRepository.findByEmail(normalizedEmail, true);

    if (!user) {
      throw new ApiError(401, AUTH.MESSAGES.INVALID_CREDENTIALS, AUTH.CODES.INVALID_CREDENTIALS);
    }

    const isPasswordValid = await verifyPassword(password, user.passwordHash);

    if (!isPasswordValid) {
      throw new ApiError(401, AUTH.MESSAGES.INVALID_CREDENTIALS, AUTH.CODES.INVALID_CREDENTIALS);
    }

    return {
      message: AUTH.MESSAGES.LOGIN_SUCCESS,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
      }
    };
  }

  async getCurrentUser(userId) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new ApiError(404, AUTH.MESSAGES.USER_NOT_FOUND, AUTH.CODES.USER_NOT_FOUND);
    }
    return {
      message: "User fetched Successfully",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
    };
  }

  async logout() {

    return {
      message: AUTH.MESSAGES.LOGOUT_SUCCESS,
      data: null,
    };
  }

  async editProfile(userId, userData) {
    const allowedFields = ["name"];
    const providedFields = Object.keys(userData);
    const hasInvalidField = providedFields.some((field) => !allowedFields.includes(field));
    if (hasInvalidField) {
      throw new ApiError(400, "Only name can be edited.",
        "INVALID_PROFILE_FIELD"
      );
    }

    const { name } = userData;
    const updatedUser = await userRepository.updateName(userId, name);

    if (!updatedUser) {
      throw new ApiError(404, AUTH.MESSAGES.USER_NOT_FOUND, AUTH.CODES.USER_NOT_FOUND);
    }
    return {
      message: AUTH.MESSAGES.UPDATE_SUCCESS,
      data: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,

      }
    };

  }

  async changePassword(userId, { currentPassword, newPassword }) {
    if (!userId) {
      throw new ApiError(401, AUTH.MESSAGES.UNAUTHORIZED, AUTH.CODES.UNAUTHORIZED);
    }

    const user = await userRepository.findByIdWithPassword(userId);
    if (!user) {
      throw new ApiError(404, AUTH.MESSAGES.USER_NOT_FOUND, AUTH.CODES.USER_NOT_FOUND);
    }

    const isCurrentValid = await verifyPassword(currentPassword, user.passwordHash);
    if (!isCurrentValid) {
      throw new ApiError(
        400,
        AUTH.MESSAGES.INVALID_CURRENT_PASSWORD,
        AUTH.CODES.INVALID_CURRENT_PASSWORD
      );
    }

    const isSamePassword = await verifyPassword(newPassword, user.passwordHash);
    if (isSamePassword) {
      throw new ApiError(
        400,
        AUTH.MESSAGES.SAME_PASSWORD,
        AUTH.CODES.SAME_PASSWORD
      );
    }

    const passwordHash = await hashPassword(newPassword);
    await userRepository.updatePassword(userId, passwordHash);

    return {
      message: AUTH.MESSAGES.PASSWORD_CHANGED,
      data: null,
    };
  }

  async deleteAccount(userId) {
    if (!userId) {
      throw new ApiError(401, AUTH.MESSAGES.UNAUTHORIZED, AUTH.CODES.UNAUTHORIZED);
    }

    const user = await userRepository.findById(userId);
    if (!user) {
      throw new ApiError(404, AUTH.MESSAGES.USER_NOT_FOUND, AUTH.CODES.USER_NOT_FOUND);
    }

    // Find all forms owned by this user
    const userForms = await formRepository.findOwnerById(userId);
    const formIds = userForms.map((form) => form._id);

    // Delete all responses associated with the user's forms
    if (formIds.length > 0) {
      await responseRepository.deleteByFormIds(formIds);
    }

    // Delete all forms owned by the user
    await formRepository.deleteByOwnerId(userId);

    // Delete the user document
    await userRepository.deleteById(userId);

    return {
      message: AUTH.MESSAGES.ACCOUNT_DELETED,
      data: null,
    };
  }
}
export default new AuthService();