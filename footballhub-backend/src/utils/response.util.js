const successResponse = (res, data, message = 'Success', statusCode = 200) => {
  console.log("Sending success response");
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

const errorResponse = (res, message = 'Server Error', errorCode = 'INTERNAL_ERROR', statusCode = 500) => {
  console.log("Sending error response");
  return res.status(statusCode).json({
    success: false,
    message,
    errorCode,
  });
};

module.exports = {
  successResponse,
  errorResponse,
};
