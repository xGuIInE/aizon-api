const AWS = require("aws-sdk");
const { formatHttpResponse, formatHttpError } = require("./http/responses.js");
const { createUser, deleteUser } = require("./users/manageUsers");
AWS.config.update({ region: "eu-west-1" });
const cognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider();

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

  const { email } = JSON.parse(body);

  const { USER_POOL_ID } = process.env;

  if (!email)
    return formatHttpError({
      statusCode: 400,
      message: "Email required",
    });
  switch (httpMethod) {
    case "POST":
      try {
        console.log("POST");
        await createUser(email, {
          adminEmail,
          USER_POOL_ID,
          cognitoIdentityServiceProvider,
        });
        return formatHttpResponse("OK");
      } catch (error) {
        return formatHttpError({
          statusCode: 500,
          message: "Internal server error " + error,
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
          message: "Internal server error " + error,
        });
      }
    default:
      return formatHttpError({
        statusCode: 400,
        message: "Only POST / DELETE request allowed",
      });
  }
};
