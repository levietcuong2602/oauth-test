const crypto = require("crypto");

// Must be 256 bits (32 characters)
const { PEPPER } = require("../config");

const IV_LENGTH = 16; // For AES, this is always 16

const hashSHA512 = (text) => {
  return crypto.createHash("sha512").update(text).digest("hex");
};

const encrypt = (text) => {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv("aes-256-ctr", Buffer.from(PEPPER), iv);
  let encrypted = cipher.update(text);

  encrypted = Buffer.concat([encrypted, cipher.final()]);

  return `${iv.toString("hex")}:${encrypted.toString("hex")}`;
};

const decrypt = (text) => {
  const textParts = text.split(":");
  const iv = Buffer.from(textParts.shift(), "hex");
  const encryptedText = Buffer.from(textParts.join(":"), "hex");
  const decipher = crypto.createDecipheriv(
    "aes-256-ctr",
    Buffer.from(PEPPER),
    iv
  );
  let decrypted = decipher.update(encryptedText);

  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return decrypted.toString();
};

module.exports = { decrypt, encrypt, hashSHA512 };
