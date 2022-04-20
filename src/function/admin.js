const AWS = require("aws-sdk");
AWS.config.update({ region: "eu-west-1" });
const cognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider();
const dbClient = new AWS.DynamoDB({ apiVersion: "2012-08-10" });
const { v4: uuidv4 } = require("uuid");
const { formatHttpResponse, formatHttpError } = require("./http/responses.js");
const { createUser, deleteUser } = require("./users/manageUsers");
const { writeDB } = require("./db/manageDB");
const {
  JSON_BODY_REQUIRED,
  EMAIL_REQUIRED,
  INTERNAL,
  HTTP_METHOD_ERROR,
  EMAIL_AND_PASSWD_REQUIRED,
  NAME_AND_OWNER_REQUIRED,
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

  // REQUIRED    , optional
  let name, owner, desc, icon;

  if (parseJSON(body)) {
    name = parseJSON(body).name;
    owner = parseJSON(body).owner;
    desc = parseJSON(body).desc || "";
    icon = parseJSON(body).icon || "";
  } else {
    return formatHttpError({
      statusCode: 400,
      message: JSON_BODY_REQUIRED,
    });
  }

  if (!name || !owner)
    return formatHttpError({
      statusCode: 400,
      message: NAME_AND_OWNER_REQUIRED,
    });

  switch (httpMethod) {
    case "POST":
      try {
        await writeDB(dbClient, {
          TABLE_NAME: SOLUTIONS_TABLE_NAME,
          uuid: uuidv4(),
          owner,
          name,
          desc,
          icon,
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
