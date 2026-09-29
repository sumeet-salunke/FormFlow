import crypto from "crypto";

const generatePublicId = () => {
  return crypto.randomBytes(16).toString("hex");
}

export default generatePublicId;