const formatHttpResponse = function (body) {
  const response = {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
    },
    isBase64Encoded: false,
    body: body,
  };
  return response;
};

const formatHttpError = function (error) {
  const response = {
    statusCode: error.statusCode,
    headers: {
      "Content-Type": "text/plain",
    },
    isBase64Encoded: false,
    body: error.message,
  };
  return response;
};

module.exports = { formatHttpResponse, formatHttpError };
