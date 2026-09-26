import argon2 from "argon2";
/**
 * Hashes a plainText password using Argon2id.
 * 
 * Password hashing is intentionally kept inside the utility layer.
 * Services should not need to know how Argon2 is configured.
 */
const hashPassword = async (password) => {
  return argon2.hash(password, {
    type: argon2.argon2id,
  });
};
/**
 * verifies the plaintext against the Argon2 hash.
 * 
 * returns true when the password matches.
 */

const verifyPassword = async (password, passwordHash) => {
  return argon2.verify(password, passwordHash);
};

export { hashPassword, verifyPassword };