const { ethers } = require("ethers");

const verifyMessage = async ({ message, address, signature }) => {
  try {
    const signerAddr = await ethers.utils.verifyMessage(message, signature);
    if (signerAddr !== address) {
      return false;
    }

    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
};

module.exports = { verifyMessage };
