// DRY- don't Repeat Yourself theory :: create a error handler middleware to avoid same try catch multiple time

const asyncHandler = fn => (req, res, next) => {
      Promise.resolve(fn(req, res, next)).catch(next);
}

module.exports = asyncHandler;