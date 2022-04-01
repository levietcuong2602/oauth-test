const crypto = require("crypto");

const hashSHA512 = (text) => {
  return crypto.createHash("sha512").update(text).digest("hex");
};

module.exports = { hashSHA512 };
