export class CustomError extends Error {
  constructor(options, ...params) {
    super(...params);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CustomError);
    }
    this.options = options;
  }
}
