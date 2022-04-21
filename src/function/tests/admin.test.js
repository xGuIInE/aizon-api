const index = require("../admin");
const AWSXRay = require("aws-xray-sdk-core");
AWSXRay.setContextMissingStrategy("LOG_ERROR");
const {
  JSON_BODY_REQUIRED,
  EMAIL_REQUIRED,
  HTTP_METHOD_ERROR,
  INVALID_FIELDS,
} = require("../errors/messages");
const adminUserMock = require("./mocks/adminUsers.json");
// Solution mocks
const createSolutionMock = require("./mocks/solutions/createSolution.json");
const deleteSolutionMock = require("./mocks/solutions/deleteSolution.json");
const modifySolutionMock = require("./mocks/solutions/modifySolution.json");
const getSolutionsMock = require("./mocks/solutions/getSolution.json");
// Screen mocks
const createScreenMock = require("./mocks/screens/createScreen.json");
const deleteScreenMock = require("./mocks/screens/deleteScreen.json");
const modifyScreenMock = require("./mocks/screens/modifyScreen.json");
const getScreensMock = require("./mocks/screens/getScreen.json");
// Widgets mocks
const createWidgetMock = require("./mocks/widgets/createWidget.json");
const deleteWidgetMock = require("./mocks/widgets/deleteWidget.json");
const modifyWidgetMock = require("./mocks/widgets/modifyWidget.json");
const getWidgetsMock = require("./mocks/widgets/getWidget.json");
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
    let response = await index.adminSolutions(createSolutionMock, null);
    expect(response.statusCode).toBe(200);
    expect(response.body).toBe("OK");
  });
  test("Can delete solutions", async () => {
    let response = await index.adminSolutions(deleteSolutionMock, null);
    expect(response.statusCode).toBe(200);
    expect(response.body).toBe("OK");
  });
  test("Can modify solutions", async () => {
    let response = await index.adminSolutions(modifySolutionMock, null);
    expect(response.statusCode).toBe(200);
    expect(response.body).toBe("OK");
  });
  test("Can get solutions", async () => {
    let response = await index.adminSolutions(getSolutionsMock, null);
    expect(response.statusCode).toBe(200);
    expect(response.body).toBe(SOLUTIONS_MOCK.Items);
  });
  test("Can't create solutions with bad fields", async () => {
    createSolutionMock.body = JSON.stringify({ bad: true });
    let response = await index.adminSolutions(createSolutionMock, null);
    expect(response.statusCode).toBe(400);
    expect(response.body).toBe(INVALID_FIELDS);
  });
  test("Can't delete solutions with bad fields", async () => {
    deleteSolutionMock.body = JSON.stringify({ bad: true });
    let response = await index.adminSolutions(deleteSolutionMock, null);
    expect(response.statusCode).toBe(400);
    expect(response.body).toBe(INVALID_FIELDS);
  });
  test("Can't modify solutions with bad fields", async () => {
    modifySolutionMock.body = JSON.stringify({ bad: true });
    let response = await index.adminSolutions(modifySolutionMock, null);
    expect(response.statusCode).toBe(400);
    expect(response.body).toBe(INVALID_FIELDS);
  });
  test("Only GET/POST/DELETE/PATCH is allowed", async () => {
    createSolutionMock.httpMethod = "PUT";
    let response = await index.adminSolutions(createSolutionMock, null);
    expect(response.statusCode).toBe(400);
    expect(response.body).toBe(HTTP_METHOD_ERROR);
  });
  test("Json body is required", async () => {
    createSolutionMock.body = null;
    let response = await index.adminSolutions(createSolutionMock, null);
    expect(response.statusCode).toBe(400);
    expect(response.body).toBe(JSON_BODY_REQUIRED);
  });
});

describe("Manage screens", () => {
  test("Can create screens", async () => {
    let response = await index.adminScreens(createScreenMock, null);
    expect(response.statusCode).toBe(200);
    expect(response.body).toBe("OK");
  });
  test("Can delete screens", async () => {
    let response = await index.adminScreens(deleteScreenMock, null);
    expect(response.statusCode).toBe(200);
    expect(response.body).toBe("OK");
  });
  test("Can modify screens", async () => {
    let response = await index.adminScreens(modifyScreenMock, null);
    expect(response.statusCode).toBe(200);
    expect(response.body).toBe("OK");
  });
  test("Can get screens", async () => {
    let response = await index.adminScreens(getScreensMock, null);
    expect(response.statusCode).toBe(200);
    expect(response.body).toBe(SOLUTIONS_MOCK.Items);
  });
  test("Can't create screens with bad fields", async () => {
    createScreenMock.body = JSON.stringify({ bad: true });
    let response = await index.adminScreens(createScreenMock, null);
    expect(response.statusCode).toBe(400);
    expect(response.body).toBe(INVALID_FIELDS);
  });
  test("Can't delete screens with bad fields", async () => {
    deleteScreenMock.body = JSON.stringify({ bad: true });
    let response = await index.adminScreens(deleteScreenMock, null);
    expect(response.statusCode).toBe(400);
    expect(response.body).toBe(INVALID_FIELDS);
  });
  test("Can't modify screens with bad fields", async () => {
    modifyScreenMock.body = JSON.stringify({ bad: true });
    let response = await index.adminScreens(modifyScreenMock, null);
    expect(response.statusCode).toBe(400);
    expect(response.body).toBe(INVALID_FIELDS);
  });
  test("Only GET/POST/DELETE/PATCH is allowed", async () => {
    createScreenMock.httpMethod = "PUT";
    let response = await index.adminScreens(createScreenMock, null);
    expect(response.statusCode).toBe(400);
    expect(response.body).toBe(HTTP_METHOD_ERROR);
  });
  test("Json body is required", async () => {
    createScreenMock.body = null;
    let response = await index.adminScreens(createScreenMock, null);
    expect(response.statusCode).toBe(400);
    expect(response.body).toBe(JSON_BODY_REQUIRED);
  });
});

describe("Manage widgets", () => {
  test("Can create widgets", async () => {
    let response = await index.adminWidgets(createWidgetMock, null);
    expect(response.statusCode).toBe(200);
    expect(response.body).toBe("OK");
  });
  test("Can delete widgets", async () => {
    let response = await index.adminWidgets(deleteWidgetMock, null);
    expect(response.statusCode).toBe(200);
    expect(response.body).toBe("OK");
  });
  test("Can modify widgets", async () => {
    let response = await index.adminWidgets(modifyWidgetMock, null);
    expect(response.statusCode).toBe(200);
    expect(response.body).toBe("OK");
  });
  test("Can get widgets", async () => {
    let response = await index.adminWidgets(getWidgetsMock, null);
    expect(response.statusCode).toBe(200);
    expect(response.body).toBe(SOLUTIONS_MOCK.Items);
  });
  test("Can't create widgets with bad fields", async () => {
    createWidgetMock.body = JSON.stringify({ bad: true });
    let response = await index.adminWidgets(createWidgetMock, null);
    expect(response.statusCode).toBe(400);
    expect(response.body).toBe(INVALID_FIELDS);
  });
  test("Can't delete widgets with bad fields", async () => {
    deleteWidgetMock.body = JSON.stringify({ bad: true });
    let response = await index.adminWidgets(deleteWidgetMock, null);
    expect(response.statusCode).toBe(400);
    expect(response.body).toBe(INVALID_FIELDS);
  });
  test("Can't modify widgets with bad fields", async () => {
    modifyWidgetMock.body = JSON.stringify({ bad: true });
    let response = await index.adminWidgets(modifyWidgetMock, null);
    expect(response.statusCode).toBe(400);
    expect(response.body).toBe(INVALID_FIELDS);
  });
  test("Only GET/POST/DELETE/PATCH is allowed", async () => {
    createWidgetMock.httpMethod = "PUT";
    let response = await index.adminWidgets(createWidgetMock, null);
    expect(response.statusCode).toBe(400);
    expect(response.body).toBe(HTTP_METHOD_ERROR);
  });
  test("Json body is required", async () => {
    createWidgetMock.body = null;
    let response = await index.adminWidgets(createWidgetMock, null);
    expect(response.statusCode).toBe(400);
    expect(response.body).toBe(JSON_BODY_REQUIRED);
  });
});
