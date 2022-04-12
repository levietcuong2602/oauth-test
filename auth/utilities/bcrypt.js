const bcrypt = require("bcrypt");
const { hashSHA512, encrypt } = require("./security");

const compareBcrypt = async (data, hashed) => {
  const isCorrect = await new Promise((resolve, reject) => {
    bcrypt.compare(data, hashed, (err, same) => {
      if (err) reject(err);
      resolve(same);
    });
  });
  return isCorrect;
};

const hashBcrypt = async (text, salt) => {
  const hashedBcrypt = new Promise((resolve, reject) => {
    bcrypt.hash(text, salt, (err, hash) => {
      if (err) reject(err);
      resolve(hash);
    });
  });
  return hashedBcrypt;
};

const generateSalt = (rounds) => bcrypt.genSaltSync(rounds);

const encryptPassword = async (password, salt) => {
  // Transform the plaintext password to hash value using SHA512
  const hashedSHA512 = hashSHA512(password);

  // Hash using bcrypt with a const of 10 and unique, per-user salt
  const hashedBcrypt = await hashBcrypt(hashedSHA512, salt);

  // Encrypt the resulting bcrypt hash with AES256
  const encryptAES256 = encrypt(hashedBcrypt);

  const encryptedPassword = encryptAES256;
  return encryptedPassword;
};

module.exports = { compareBcrypt, hashBcrypt, generateSalt, encryptPassword };
