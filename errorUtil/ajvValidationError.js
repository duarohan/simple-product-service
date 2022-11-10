const ApiError = require('./apiError');

function ajvValidationError(errorDetail, fieldCategory) {
  let bodyError;
  if (errorDetail.params.missingProperty) {
    bodyError = `${fieldCategory}${errorDetail.instancePath}.${errorDetail.params.missingProperty.replace(/^\./, '')}.required`;
  } else {
    bodyError = `${fieldCategory}${errorDetail.instancePath.replace(/^\//, '.')}.invalid`;
  }

  return new ApiError('Invalid Request', 400, bodyError);
};

module.exports = ajvValidationError;