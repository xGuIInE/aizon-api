const AWS = require("aws-sdk");
AWS.config.update({ region: "eu-west-1" });
const dbClient = new AWS.DynamoDB({ apiVersion: "2012-08-10" });
const { formatHttpResponse, formatHttpError } = require("./http/responses.js");
const {
  getSolutionsForUser,
  getScreensForUser,
  getWidgetsForUser,
} = require("./db/manageDB");

const { INTERNAL, HTTP_METHOD_ERROR } = require("./errors/messages");

exports.clientUsers = async function (event, context) {
  const {
    httpMethod,
    requestContext: {
      authorizer: {
        claims: { "cognito:username": userEmail },
      },
    },
  } = event;

  const { SOLUTIONS_TABLE_NAME, SCREENS_TABLE_NAME, WIDGETS_TABLE_NAME } =
    process.env;

  switch (httpMethod) {
    case "GET":
      try {
        // Get user solutions
        const solutions = await getSolutionsForUser(dbClient, {
          TABLE_NAME: SOLUTIONS_TABLE_NAME,
          user: userEmail,
        });
        // Get user screens
        const screens = await getScreensForUser(dbClient, {
          TABLE_NAME: SCREENS_TABLE_NAME,
          solution_ids: solutions.map((solution) => solution.id.S),
        });
        // Get user screens
        const widgets = await getWidgetsForUser(dbClient, {
          TABLE_NAME: WIDGETS_TABLE_NAME,
          screens_ids: screens.map((screen) => screen.map((s) => s.id.S)),
        });

        return formatHttpResponse({
          solutions,
          screens: screens.flat(),
          widgets,
        });
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
