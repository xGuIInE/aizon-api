const index = require("./admin");
const AWSXRay = require("aws-xray-sdk-core");
AWSXRay.setContextMissingStrategy("LOG_ERROR");
const {
  JSON_BODY_REQUIRED,
  EMAIL_REQUIRED,
  HTTP_METHOD_ERROR,
  INVALID_FIELDS,
} = require("./errors/messages");
const adminUserMock = require("./mocks/adminUsers.json");
const createSolutionsMock = require("./mocks/createSolution.json");
const deleteSolutionsMock = require("./mocks/deleteSolution.json");
const modifySolution = require("./mocks/modifySolution.json");
const getSolutionsMock = require("./mocks/getSolution.json");
const SOLUTIONS_MOCK = { Items: [{ solutions: true }] };
// jest.mock("aws-sdk");
jest.mock("aws-sdk", () => {
  return {
    config: {
      update() {
        return {};
      },
    },
    DynamoDB: class {
      batchWriteItem() {
        return this;
      }
      deleteItem() {
        return this;
      }
      scan() {
        return this;
      }
      promise() {
        return SOLUTIONS_MOCK;
      }
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

describe("Admin users", () => {
  // Admin users
  test("Can create users", async () => {
    adminUserMock.httpMethod = "POST";
    let response = await index.adminUsers(adminUserMock, null);
    expect(response.statusCode).toBe(200);
    expect(response.body).toBe("OK");
  });

  test("Can delete users", async () => {
    adminUserMock.httpMethod = "DELETE";
    let response = await index.adminUsers(adminUserMock, null);
    expect(response.statusCode).toBe(200);
    expect(response.body).toBe("OK");
  });

  test("Only POST/DELETE is allowed", async () => {
    adminUserMock.httpMethod = "PATCH";
    let response = await index.adminUsers(adminUserMock, null);
    expect(response.statusCode).toBe(400);
    expect(response.body).toBe(HTTP_METHOD_ERROR);
  });

  test("Json body is required", async () => {
    adminUserMock.body = null;
    let response = await index.adminUsers(adminUserMock, null);
    expect(response.statusCode).toBe(400);
    expect(response.body).toBe(JSON_BODY_REQUIRED);
  });

  test("Email is required", async () => {
    adminUserMock.body = JSON.stringify({ dummy: true });
    let response = await index.adminUsers(adminUserMock, null);
    expect(response.statusCode).toBe(400);
    expect(response.body).toBe(EMAIL_REQUIRED);
  });
});

describe("Manage solutions", () => {
  test("Can create solutions", async () => {
    let response = await index.adminSolutions(createSolutionsMock, null);
    expect(response.statusCode).toBe(200);
    expect(response.body).toBe("OK");
  });
  test("Can delete solutions", async () => {
    let response = await index.adminSolutions(deleteSolutionsMock, null);
    expect(response.statusCode).toBe(200);
    expect(response.body).toBe("OK");
  });
  test("Can modify solutions", async () => {
    let response = await index.adminSolutions(modifySolution, null);
    expect(response.statusCode).toBe(200);
    expect(response.body).toBe("OK");
  });
  test("Can get solutions", async () => {
    let response = await index.adminSolutions(getSolutionsMock, null);
    expect(response.statusCode).toBe(200);
    expect(response.body).toBe(SOLUTIONS_MOCK.Items);
  });
  test("Can't create solutions with bad fields", async () => {
    createSolutionsMock.body = JSON.stringify({ bad: true });
    let response = await index.adminSolutions(createSolutionsMock, null);
    expect(response.statusCode).toBe(400);
    expect(response.body).toBe(INVALID_FIELDS);
  });
  test("Can't delete solutions with bad fields", async () => {
    deleteSolutionsMock.body = JSON.stringify({ bad: true });
    let response = await index.adminSolutions(deleteSolutionsMock, null);
    expect(response.statusCode).toBe(400);
    expect(response.body).toBe(INVALID_FIELDS);
  });
  test("Can't modify solutions with bad fields", async () => {
    modifySolution.body = JSON.stringify({ bad: true });
    let response = await index.adminSolutions(modifySolution, null);
    expect(response.statusCode).toBe(400);
    expect(response.body).toBe(INVALID_FIELDS);
  });
  test("Only GET/POST/DELETE/PATCH is allowed", async () => {
    createSolutionsMock.httpMethod = "PUT";
    let response = await index.adminSolutions(createSolutionsMock, null);
    expect(response.statusCode).toBe(400);
    expect(response.body).toBe(HTTP_METHOD_ERROR);
  });
  test("Json body is required", async () => {
    createSolutionsMock.body = null;
    let response = await index.adminSolutions(createSolutionsMock, null);
    expect(response.statusCode).toBe(400);
    expect(response.body).toBe(JSON_BODY_REQUIRED);
  });
});
