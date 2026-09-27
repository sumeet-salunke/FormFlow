import { hashPassword, verifyPassword } from "../utils/password.js";
import userRepository from "../repositories/user.repository.js";
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
}
export default new AuthService();