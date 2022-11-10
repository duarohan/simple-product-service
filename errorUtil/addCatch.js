const ApiError = require('./apiError');

function addCatch(middlewareHandler) {
  return (res, req, next) => {
    Promise.resolve(middlewareHandler(res, req, next))
      .catch((error) => {
        next(new ApiError('Internal server error', 500));
      });
  };
}

module.exports = addCatch;
