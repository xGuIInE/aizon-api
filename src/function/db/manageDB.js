// Solutions
const writeDBSolution = async function (dbClient, data) {
  const { TABLE_NAME, uuid, owner, name, desc, icon } = data;
  var params = {
    RequestItems: {
      [TABLE_NAME]: [
        {
          PutRequest: {
            Item: {
              id: { S: uuid },
              owner: { S: owner },
              name: { S: name },
              desc: { S: desc || "" },
              icon: { S: icon || "" },
            },
          },
        },
      ],
    },
  };

  await dbClient.batchWriteItem(params).promise();
  console.log(`Added solution in ${TABLE_NAME}`);
};

const modifyDBSolution = async function (dbClient, data) {
  const { TABLE_NAME, id, owner, name, desc, icon } = data;
  var params = {
    RequestItems: {
      [TABLE_NAME]: [
        {
          PutRequest: {
            Item: {
              id: { S: id },
              owner: { S: owner },
              name: { S: name },
              desc: { S: desc || "" },
              icon: { S: icon || "" },
            },
          },
        },
      ],
    },
  };

  await dbClient.batchWriteItem(params).promise();
  console.log(`Modified solution ${id} in ${TABLE_NAME}`);
};

const deleteDBSolution = async function (dbClient, data) {
  const { TABLE_NAME, id, owner } = data;
  const params = {
    TableName: TABLE_NAME,
    Key: { id: { S: id }, owner: { S: owner } },
  };

  await dbClient.deleteItem(params).promise();
  console.log(`Deleted solution in ${TABLE_NAME}`);
};

const getDBAllFromTables = async function (dbClient, data) {
  const { TABLE_NAME } = data;

  const params = {
    TableName: TABLE_NAME,
  };

  const solutions = await dbClient.scan(params).promise();

  console.log(`Obtained ${TABLE_NAME} solution`);
  return solutions.Items;
};
// Screens
const writeDBScreen = async function (dbClient, data) {
  const { TABLE_NAME, uuid, solution_id, name, desc, icon } = data;
  var params = {
    RequestItems: {
      [TABLE_NAME]: [
        {
          PutRequest: {
            Item: {
              id: { S: uuid },
              solution_id: { S: solution_id },
              name: { S: name },
              desc: { S: desc || "" },
              icon: { S: icon || "" },
            },
          },
        },
      ],
    },
  };

  await dbClient.batchWriteItem(params).promise();
  console.log(`Added screen in ${TABLE_NAME}`);
};

const modifyDBScreen = async function (dbClient, data) {
  const { TABLE_NAME, id, solution_id, name, desc, icon } = data;
  var params = {
    RequestItems: {
      [TABLE_NAME]: [
        {
          PutRequest: {
            Item: {
              id: { S: id },
              solution_id: { S: solution_id },
              name: { S: name || "" },
              desc: { S: desc || "" },
              icon: { S: icon || "" },
            },
          },
        },
      ],
    },
  };

  await dbClient.batchWriteItem(params).promise();
  console.log(`Added screen in ${TABLE_NAME}`);
};

const deleteDBScreen = async function (dbClient, data) {
  const { TABLE_NAME, id, solution_id } = data;
  const params = {
    TableName: TABLE_NAME,
    Key: { id: { S: id }, solution_id: { S: solution_id } },
  };

  await dbClient.deleteItem(params).promise();
  console.log(`Deleted screen in ${TABLE_NAME}`);
};

// Widgets
const writeDBWidget = async function (dbClient, data) {
  const { TABLE_NAME, uuid, screen_id, name, desc, icon, data: wData } = data;
  var params = {
    RequestItems: {
      [TABLE_NAME]: [
        {
          PutRequest: {
            Item: {
              id: { S: uuid },
              screen_id: { S: screen_id },
              name: { S: name },
              data: { S: wData },
              desc: { S: desc || "" },
              icon: { S: icon || "" },
            },
          },
        },
      ],
    },
  };

  await dbClient.batchWriteItem(params).promise();
  console.log(`Added widget in ${TABLE_NAME}`);
};
const modifyDBWidget = async function (dbClient, data) {
  const { TABLE_NAME, id, screen_id, name, desc, icon, data: wData } = data;
  var params = {
    RequestItems: {
      [TABLE_NAME]: [
        {
          PutRequest: {
            Item: {
              id: { S: id },
              screen_id: { S: screen_id },
              name: { S: name },
              data: { S: wData },
              desc: { S: desc || "" },
              icon: { S: icon || "" },
            },
          },
        },
      ],
    },
  };

  await dbClient.batchWriteItem(params).promise();
  console.log(`Added widget in ${TABLE_NAME}`);
};
const deleteDBWidget = async function (dbClient, data) {
  const { TABLE_NAME, id, screen_id } = data;
  const params = {
    TableName: TABLE_NAME,
    Key: { id: { S: id }, screen_id: { S: screen_id } },
  };

  await dbClient.deleteItem(params).promise();
  console.log(`Deleted solution in ${TABLE_NAME}`);
};

// Clients
async function getSolutionsForUser(dbClient, data) {
  const { TABLE_NAME, user, SOLUTIONS_TABLE_INDEX } = data;
  console.log(JSON.stringify(data));
  const solutions = await dbClient
    .query({
      TableName: TABLE_NAME,
      IndexName: SOLUTIONS_TABLE_INDEX || "owner-key",
      ExpressionAttributeNames: {
        "#owner": "owner",
      },
      KeyConditionExpression: "#owner = :sOwner",
      ExpressionAttributeValues: {
        ":sOwner": { S: user },
      },
    })
    .promise();

  console.log("SOLUTIONS: ", JSON.stringify(solutions));
  return solutions.Items;
}

async function getScreensForUser(dbClient, data) {
  const { TABLE_NAME, solution_ids, SCREENS_TABLE_INDEX } = data;
  console.log("[SOLUTIONS] Ids for screens: ", JSON.stringify(solution_ids));
  const screens = await Promise.all(
    solution_ids.map((solution_id) =>
      dbClient
        .query({
          TableName: TABLE_NAME,
          IndexName: SCREENS_TABLE_INDEX || "solution_id-key",
          KeyConditionExpression: "solution_id = :sSolution_id",
          ExpressionAttributeValues: {
            ":sSolution_id": { S: solution_id },
          },
        })
        .promise()
    )
  );

  console.log("SCREENS: ", JSON.stringify(screens));

  return screens.map((screen) => screen.Items);
}

async function getWidgetsForUser(dbClient, data) {
  const { TABLE_NAME, screens_ids, WIDGETS_TABLE_INDEX } = data;
  console.log(
    "[SCREENS] ids for widgets: ",
    JSON.stringify(screens_ids.flat())
  );
  const widgets = await Promise.all(
    screens_ids.flat().map((screen_id) =>
      dbClient
        .query({
          TableName: TABLE_NAME,
          IndexName: WIDGETS_TABLE_INDEX || "screen_id-key",
          KeyConditionExpression: "screen_id = :sScreen_id",
          ExpressionAttributeValues: {
            ":sScreen_id": { S: screen_id },
          },
        })
        .promise()
    )
  );

  console.log("WIDGETS: ", JSON.stringify(widgets));

  return widgets.map((widget) => widget.Items).flat();
}

module.exports = {
  writeDBSolution,
  deleteDBSolution,
  modifyDBSolution,
  getDBAllFromTables,
  writeDBScreen,
  modifyDBScreen,
  deleteDBScreen,
  writeDBWidget,
  modifyDBWidget,
  deleteDBWidget,
  getSolutionsForUser,
  getScreensForUser,
  getWidgetsForUser,
};
