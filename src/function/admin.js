const AWS = require("aws-sdk");
AWS.config.update({ region: "eu-west-1" });
const cognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider();
const dbClient = new AWS.DynamoDB({ apiVersion: "2012-08-10" });
const { v4: uuidv4 } = require("uuid");
const { formatHttpResponse, formatHttpError } = require("./http/responses.js");
const { createUser, deleteUser } = require("./users/manageUsers");
const {
  writeDBSolution,
  deleteDBSolution,
  modifyDBSolution,
  getDBSolutions,
} = require("./db/manageDB");
const { checkRequiredKeys } = require("./db/keys");
const {
  JSON_BODY_REQUIRED,
  EMAIL_REQUIRED,
  INTERNAL,
  HTTP_METHOD_ERROR,
  EMAIL_AND_PASSWD_REQUIRED,
  INVALID_FIELDS,
} = require("./errors/messages");
const parseJSON = require("./utils/parseJSON");

// Admin users
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

  // REQUIRED BODY DATA
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

exports.adminSolutions = async function (event, context) {
  const {
    httpMethod,
    body,
    requestContext: {
      authorizer: {
        claims: { "cognito:username": adminEmail },
      },
    },
  } = event;

  const { SOLUTIONS_TABLE_NAME } = process.env;

  let parsedBody;

  if ((parsedBody = parseJSON(body))) {
    if (!checkRequiredKeys(httpMethod, parsedBody))
      return formatHttpError({
        statusCode: 400,
        message: INVALID_FIELDS,
      });
  } else {
    return formatHttpError({
      statusCode: 400,
      message: JSON_BODY_REQUIRED,
    });
  }

  switch (httpMethod) {
    case "GET":
      try {
        const solutions = await getDBSolutions(dbClient, {
          TABLE_NAME: SOLUTIONS_TABLE_NAME,
          ...parsedBody,
        });
        return formatHttpResponse(solutions);
      } catch (error) {
        return formatHttpError({
          statusCode: 500,
          message: INTERNAL + error,
        });
      }
    case "POST":
      try {
        await writeDBSolution(dbClient, {
          TABLE_NAME: SOLUTIONS_TABLE_NAME,
          uuid: uuidv4(),
          ...parsedBody,
        });
        return formatHttpResponse("OK");
      } catch (error) {
        return formatHttpError({
          statusCode: 500,
          message: INTERNAL + error,
        });
      }
    case "PATCH":
      try {
        await modifyDBSolution(dbClient, {
          TABLE_NAME: SOLUTIONS_TABLE_NAME,
          ...parsedBody,
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
        await deleteDBSolution(dbClient, {
          TABLE_NAME: SOLUTIONS_TABLE_NAME,
          ...parsedBody,
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
exports.adminScreens = async function (event, context) {};
exports.adminWidgets = async function (event, context) {};

exports.clientUsers = async function (event, context) {
  const { httpMethod, body } = event;

  const { USER_POOL_ID } = process.env;

  let email, passwd;

  if (parseJSON(body)) {
    email = parseJSON(body).email;
    passwd = parseJSON(body).passwd;
  } else {
    return formatHttpError({
      statusCode: 400,
      message: JSON_BODY_REQUIRED,
    });
  }

  if (!email || !passwd)
    return formatHttpError({
      statusCode: 400,
      message: EMAIL_AND_PASSWD_REQUIRED,
    });

  return formatHttpResponse("NEW");
};
