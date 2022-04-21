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
  console.log(id);
  const params = {
    TableName: TABLE_NAME,
    Key: { id: { S: id }, owner: { S: owner } },
  };

  await dbClient.deleteItem(params).promise();
  console.log(`Deleted solution in ${TABLE_NAME}`);
};

const getDBSolutions = async function (dbClient, data) {
  const { TABLE_NAME } = data;

  const params = {
    TableName: TABLE_NAME,
  };

  const solutions = await dbClient.scan(params).promise();

  console.log(`Obtained ${TABLE_NAME} solution`);
  return solutions.Items;
};

module.exports = {
  writeDBSolution,
  deleteDBSolution,
  modifyDBSolution,
  getDBSolutions,
};
