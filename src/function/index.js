const AWS = require("aws-sdk");
AWS.config.update({ region: "eu-west-1" });
const cognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider();
const { formatHttpResponse, formatHttpError } = require("./http/responses.js");
const { createUser, deleteUser } = require("./users/manageUsers");
const {
  JSON_BODY_REQUIRED,
  EMAIL_REQUIRED,
  INTERNAL,
  HTTP_METHOD_ERROR,
} = require("./errors/messages");
const parseJSON = require("./utils/parseJSON");

exports.adminUsers = async function (event, context) {
  const {
    httpMethod,
    body,
    requestContext: {
      authorizer: {
        claims: { "cognito:username": adminEmail },
      },
    },
  } = event;

  const { USER_POOL_ID } = process.env;

  let email;

  if (parseJSON(body)) {
    email = parseJSON(body).email;
  } else {
    return formatHttpError({
      statusCode: 400,
      message: JSON_BODY_REQUIRED,
    });
  }

  if (!email)
    return formatHttpError({
      statusCode: 400,
      message: EMAIL_REQUIRED,
    });

  switch (httpMethod) {
    case "POST":
      try {
        await createUser(email, {
          adminEmail,
          USER_POOL_ID,
          cognitoIdentityServiceProvider,
        });
        return formatHttpResponse("OK");
      } catch (error) {
        return formatHttpError({
          statusCode: 500,
          message: INTERNAL + error,
        });
      }
    case "DELETE":
      try {
        await deleteUser(email, {
          adminEmail,
          USER_POOL_ID,
          cognitoIdentityServiceProvider,
        });
        return formatHttpResponse("OK");
      } catch (error) {
        return formatHttpError({
          statusCode: 500,
          message: INTERNAL + error,
        });
      }
    default:
      return formatHttpError({
        statusCode: 400,
        message: HTTP_METHOD_ERROR,
      });
  }
};
