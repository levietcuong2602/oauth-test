const delay = (delayInms) =>
  new Promise((resolve) => setTimeout(resolve, delayInms));

module.exports = { delay };
