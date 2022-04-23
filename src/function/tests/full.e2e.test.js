const request = require("supertest");
const {
  AuthenticationResult: { IdToken: adminToken },
} = require("../../../admin/tokenId.json");

const { tokenId: clientToken } = require("../../../client/tokenId.json");

const ADMIN_API_URL =
  "https://h0zyzsfwk1.execute-api.eu-west-1.amazonaws.com/stage-admin-api";

const CLIENT_API_URL =
  "https://z49mesw6ea.execute-api.eu-west-1.amazonaws.com/stage-clients-api";

const CLIENT_EMAIL = "guine0123@gmail.com";

const ADMIN_API_ENDPOINTS = ["/solutions", "/screens", "/widgets", "/users"];
const CLIENT_API_ENDPOINTS = ["/solution"];

jest.setTimeout(30000);

const SAMPLE_SOLUTION_DATA = {
  name: "Test Solution",
  owner: CLIENT_EMAIL,
};

const SAMPLE_SCREEN_DATA = {
  name: "Test Screen",
  solution_id: "A-SOLUTION-ID",
};

const SAMPLE_WIDGET_DATA = {
  name: "Test Widget",
  screen_id: "A-SCREEN-ID",
  data: "[1, 2, 3, 4, 5, 6, 7, 8]",
};

const SAMPLE_USER = { email: "guine0123@gmail.com" };

describe("[E2E] Get solution", () => {
  it("Admin can create a full solution", async () => {
    // Create solution
    const res = await request(ADMIN_API_URL)
      .post(ADMIN_API_ENDPOINTS[0])
      .send(SAMPLE_SOLUTION_DATA)
      .set("Authorization", adminToken);
    expect(res.statusCode).toEqual(200);
    expect(res.body.res).toBe("OK");

    // Get created solution
    const resSolution = await request(ADMIN_API_URL)
      .get(ADMIN_API_ENDPOINTS[0])
      .send()
      .set("Authorization", adminToken);

    const mySolution = resSolution.body[0];
    expect(resSolution.statusCode).toEqual(200);

    // Create screen for solution
    SAMPLE_SCREEN_DATA.solution_id = mySolution.id.S;
    const resScreen = await request(ADMIN_API_URL)
      .post(ADMIN_API_ENDPOINTS[1])
      .send(SAMPLE_SCREEN_DATA)
      .set("Authorization", adminToken);
    expect(resScreen.statusCode).toEqual(200);
    expect(resScreen.body.res).toBe("OK");

    // Get created screen
    const resScreenCreated = await request(ADMIN_API_URL)
      .get(ADMIN_API_ENDPOINTS[1])
      .send()
      .set("Authorization", adminToken);

    const myScreen = resScreenCreated.body[0];
    expect(resScreenCreated.statusCode).toEqual(200);

    // Create widget for screen
    SAMPLE_WIDGET_DATA.screen_id = myScreen.id.S;
    const resWidget = await request(ADMIN_API_URL)
      .post(ADMIN_API_ENDPOINTS[2])
      .send(SAMPLE_WIDGET_DATA)
      .set("Authorization", adminToken);

    expect(resWidget.statusCode).toEqual(200);
    expect(resWidget.body.res).toBe("OK");
  });
  it("Can get solution by client", async () => {
    const res = await request(CLIENT_API_URL)
      .get(CLIENT_API_ENDPOINTS[0])
      .send()
      .set("Authorization", clientToken);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("solutions");
    expect(res.body).toHaveProperty("screens");
    expect(res.body).toHaveProperty("widgets");
  });
});
