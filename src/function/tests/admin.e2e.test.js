const request = require("supertest");
const {
  AuthenticationResult: { IdToken: adminToken },
} = require("../../../admin/tokenId.json");

const ADMIN_API_URL =
  "https://h0zyzsfwk1.execute-api.eu-west-1.amazonaws.com/stage-admin-api";

const ADMIN_API_ENDPOINTS = ["/solutions", "/screens", "/widgets", "/users"];

jest.setTimeout(30000);

const SAMPLE_SOLUTION_DATA = {
  name: "Test Solution",
  owner: "guine0123@gmail.com",
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

describe("[E2E] Admin users", () => {
  it("Can create users", async () => {
    const res = await request(ADMIN_API_URL)
      .post(ADMIN_API_ENDPOINTS[3])
      .send(SAMPLE_USER)
      .set("Authorization", adminToken);
    expect(res.statusCode).toEqual(200);
    expect(res.body.res).toBe("OK");
  });
  it("Can delete users", async () => {
    const res = await request(ADMIN_API_URL)
      .delete(ADMIN_API_ENDPOINTS[3])
      .send(SAMPLE_USER)
      .set("Authorization", adminToken);
    expect(res.statusCode).toEqual(200);
    expect(res.body.res).toBe("OK");
  });
});

describe("[E2E] Check auth for managing solutions/screens/widgets", () => {
  it("Can't create solutions/screens/widgets without auth", async () => {
    ADMIN_API_ENDPOINTS.forEach((endpoint) => {});
    const responsesPost = await Promise.all(
      ADMIN_API_ENDPOINTS.map((endpoint) =>
        request(ADMIN_API_URL).post(endpoint).send({})
      )
    );
    const responsesDelete = await Promise.all(
      ADMIN_API_ENDPOINTS.map((endpoint) =>
        request(ADMIN_API_URL).delete(endpoint).send({})
      )
    );
    const responsesGet = await Promise.all(
      ADMIN_API_ENDPOINTS.map((endpoint) =>
        request(ADMIN_API_URL).get(endpoint).send({})
      )
    );
    const responsesPatch = await Promise.all(
      ADMIN_API_ENDPOINTS.map((endpoint) =>
        request(ADMIN_API_URL).patch(endpoint).send({})
      )
    );
    responsesPost.forEach((res) => {
      expect(res.statusCode).toEqual(401);
      expect(res.body.message).toBe("Unauthorized");
    });
    responsesDelete.forEach((res) => {
      expect(res.statusCode).toEqual(401);
      expect(res.body.message).toBe("Unauthorized");
    });
    responsesGet.forEach((res) => {
      expect(res.statusCode).toEqual(403);
    });
    responsesPatch.forEach((res) => {
      expect(res.statusCode).toEqual(401);
      expect(res.body.message).toBe("Unauthorized");
    });
  });
});

describe("[E2E] Manage solutions", () => {
  it("Can create solution", async () => {
    const res = await request(ADMIN_API_URL)
      .post(ADMIN_API_ENDPOINTS[0])
      .send(SAMPLE_SOLUTION_DATA)
      .set("Authorization", adminToken);
    expect(res.statusCode).toEqual(200);
    expect(res.body.res).toBe("OK");
  });

  it("Can get/modify/delete solutions", async () => {
    const res = await request(ADMIN_API_URL)
      .get(ADMIN_API_ENDPOINTS[0])
      .send()
      .set("Authorization", adminToken);

    const mySolution = res.body[0];
    expect(res.statusCode).toEqual(200);

    // Modify
    const resModify = await request(ADMIN_API_URL)
      .patch(ADMIN_API_ENDPOINTS[0])
      .send({
        id: mySolution.id.S,
        owner: mySolution.owner.S,
        name: "New name",
        desc: "New desc",
      })
      .set("Authorization", adminToken);
    expect(resModify.statusCode).toEqual(200);
    expect(resModify.body.res).toEqual("OK");

    // Delete
    const resDelete = await request(ADMIN_API_URL)
      .delete(ADMIN_API_ENDPOINTS[0])
      .send({
        id: mySolution.id.S,
        owner: mySolution.owner.S,
      })
      .set("Authorization", adminToken);
    expect(resDelete.statusCode).toEqual(200);
    expect(resDelete.body.res).toEqual("OK");
  });
});

describe("[E2E] Manage screens", () => {
  it("Can create screen", async () => {
    const res = await request(ADMIN_API_URL)
      .post(ADMIN_API_ENDPOINTS[1])
      .send(SAMPLE_SCREEN_DATA)
      .set("Authorization", adminToken);
    expect(res.statusCode).toEqual(200);
    expect(res.body.res).toBe("OK");
  });

  it("Can get/modify/delete screens", async () => {
    const res = await request(ADMIN_API_URL)
      .get(ADMIN_API_ENDPOINTS[1])
      .send()
      .set("Authorization", adminToken);

    const myScreen = res.body[0];
    expect(res.statusCode).toEqual(200);

    // Modify
    const resModify = await request(ADMIN_API_URL)
      .patch(ADMIN_API_ENDPOINTS[1])
      .send({
        id: myScreen.id.S,
        solution_id: myScreen.solution_id.S,
        name: "New name",
        desc: "New desc",
      })
      .set("Authorization", adminToken);
    expect(resModify.statusCode).toEqual(200);
    expect(resModify.body.res).toEqual("OK");

    // Delete
    const resDelete = await request(ADMIN_API_URL)
      .delete(ADMIN_API_ENDPOINTS[1])
      .send({
        id: myScreen.id.S,
        solution_id: myScreen.solution_id.S,
      })
      .set("Authorization", adminToken);
    expect(resDelete.statusCode).toEqual(200);
    expect(resDelete.body.res).toEqual("OK");
  });
});

describe("[E2E] Manage widgets", () => {
  it("Can create widget", async () => {
    const res = await request(ADMIN_API_URL)
      .post(ADMIN_API_ENDPOINTS[2])
      .send(SAMPLE_WIDGET_DATA)
      .set("Authorization", adminToken);

    expect(res.statusCode).toEqual(200);
    expect(res.body.res).toBe("OK");
  });

  it("Can get/modify/delete widgets", async () => {
    const res = await request(ADMIN_API_URL)
      .get(ADMIN_API_ENDPOINTS[2])
      .send()
      .set("Authorization", adminToken);

    const myWidget = res.body[0];
    expect(res.statusCode).toEqual(200);

    // Modify
    const resModify = await request(ADMIN_API_URL)
      .patch(ADMIN_API_ENDPOINTS[2])
      .send({
        id: myWidget.id.S,
        screen_id: myWidget.screen_id.S,
        name: "New name",
        desc: "New desc",
        data: "[100, 200, 300, 400]",
      })
      .set("Authorization", adminToken);
    expect(resModify.statusCode).toEqual(200);
    expect(resModify.body.res).toEqual("OK");

    // Delete
    const resDelete = await request(ADMIN_API_URL)
      .delete(ADMIN_API_ENDPOINTS[2])
      .send({
        id: myWidget.id.S,
        screen_id: myWidget.screen_id.S,
      })
      .set("Authorization", adminToken);
    expect(resDelete.statusCode).toEqual(200);
    expect(resDelete.body.res).toEqual("OK");
  });
});
