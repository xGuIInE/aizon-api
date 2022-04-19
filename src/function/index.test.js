const index = require("./index");
const AWSXRay = require("aws-xray-sdk-core");
AWSXRay.setContextMissingStrategy("LOG_ERROR");
const {
  JSON_BODY_REQUIRED,
  EMAIL_REQUIRED,
  HTTP_METHOD_ERROR,
} = require("./errors/messages");
const postUser = require("./mocks/postUserAuthorized.json");

jest.mock("aws-sdk", () => {
  return {
    config: {
      update() {
        return {};
      },
    },
    CognitoIdentityServiceProvider: class {
      adminCreateUser() {
        return this;
      }

      adminDeleteUser() {
        return this;
      }

      promise() {
        return Promise.resolve("OK");
      }
    },
  };
});

test("Can create users", async () => {
  let response = await index.adminUsers(postUser, null);
  expect(response.statusCode).toBe(200);
  expect(response.body).toBe("OK");
});

test("Can delete users", async () => {
  postUser.httpMethod = "DELETE";
  let response = await index.adminUsers(postUser, null);
  expect(response.statusCode).toBe(200);
  expect(response.body).toBe("OK");
});

test("Only POST/DELETE is allowed", async () => {
  postUser.httpMethod = "PATCH";
  let response = await index.adminUsers(postUser, null);
  expect(response.statusCode).toBe(400);
  expect(response.body).toBe(HTTP_METHOD_ERROR);
});

test("Json body is required", async () => {
  postUser.body = null;
  let response = await index.adminUsers(postUser, null);
  expect(response.statusCode).toBe(400);
  expect(response.body).toBe(JSON_BODY_REQUIRED);
});

test("Email is required", async () => {
  postUser.body = JSON.stringify({ dummy: true });
  let response = await index.adminUsers(postUser, null);
  expect(response.statusCode).toBe(400);
  expect(response.body).toBe(EMAIL_REQUIRED);
});
