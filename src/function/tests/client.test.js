const client = require("../client");
const AWSXRay = require("aws-xray-sdk-core");
AWSXRay.setContextMissingStrategy("LOG_ERROR");
const { HTTP_METHOD_ERROR } = require("../errors/messages");
// Solution mocks
const getFullSolutionMock = require("./mocks/getFullSolution.json");
const mockSolutionData = require("./mocks/solutions/dbDataMock.json");
const mockScreenData = require("./mocks/screens/dbDataMock.json");
const mockWidgetData = require("./mocks/widgets/dbDataMock.json");

jest.mock("aws-sdk", () => {
  return {
    config: {
      update() {
        return {};
      },
    },
    DynamoDB: class {
      constructor() {
        this.queryParams = {};
      }
      query(params) {
        this.queryParams = params;
        return this;
      }
      promise() {
        switch (this.queryParams.IndexName) {
          case "owner-key":
            return mockSolutionData;
          case "solution_id-key":
            return mockScreenData;
          case "screen_id-key":
            return mockWidgetData;
          default:
            return {};
        }
      }
    },
  };
});

describe("Get full solution by client", () => {
  test("Can get full solutions", async () => {
    let response = await client.clientUsers(getFullSolutionMock, null);
    console.log(response);
    const jsonBody = JSON.parse(response.body);
    console.log("BOODYYY SOLUTIONS", jsonBody.solutions);
    console.log("BOODYYY SCREENS", jsonBody.screens);
    console.log("BOODYYY WIDGETS", jsonBody.widgets);

    expect(response.statusCode).toBe(200);
    expect(jsonBody).toHaveProperty("solutions");
    expect(jsonBody).toHaveProperty("screens");
    expect(jsonBody).toHaveProperty("widgets");
  });

  test("Only GET is allowed", async () => {
    getFullSolutionMock.httpMethod = "PUT";
    let response = await client.clientUsers(getFullSolutionMock, null);
    expect(response.statusCode).toBe(400);
    expect(response.body).toBe(HTTP_METHOD_ERROR);
  });
});
