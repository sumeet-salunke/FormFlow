const AUTH = {
  MESSAGES: {
    USER_REGISTERED: "Account created successfully.",
    EMAIL_ALREADY_EXISTS:
      "An account with this email already exists.",
    INVALID_CREDENTIALS: "Invalid email or password.",
    USER_NOT_FOUND: "User not found.",
    UNAUTHORIZED: "Authentication required.",
    LOGIN_SUCCESS: "Login success.",
    LOGOUT_SUCCESS: "Logout success.",
    UPDATE_SUCCESS: "Profile updated successfully.",
    PASSWORD_CHANGED: "Password changed successfully.",
    ACCOUNT_DELETED: "Account deleted successfully.",
    INVALID_CURRENT_PASSWORD: "Current password is incorrect.",
    SAME_PASSWORD: "New password must be different from current password.",
    INTERNAL_SERVER_ERROR: "Internal server error.",
  },

  CODES: {
    EMAIL_ALREADY_EXISTS: "EMAIL_ALREADY_EXISTS",
    INVALID_CREDENTIALS: "INVALID_CREDENTIALS",
    USER_NOT_FOUND: "USER_NOT_FOUND",
    UNAUTHORIZED: "UNAUTHORIZED",
    UPDATE_SUCCESS: "UPDATE_SUCCESS",
    PASSWORD_CHANGED: "PASSWORD_CHANGED",
    ACCOUNT_DELETED: "ACCOUNT_DELETED",
    INVALID_CURRENT_PASSWORD: "INVALID_CURRENT_PASSWORD",
    SAME_PASSWORD: "SAME_PASSWORD",
    LOGOUT_SUCCESS: "LOGOUT_SUCCESS",
    INTERNAL_SERVER_ERROR: "INTERNAL_SERVER_ERROR",

  },
};

export default AUTH;