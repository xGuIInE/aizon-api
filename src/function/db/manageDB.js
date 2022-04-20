const writeDB = async function (dbClient, data) {
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
              desc: { S: desc },
              icon: { S: icon },
            },
          },
        },
      ],
    },
  };

  console.log("writting...");

  await dbClient.batchWriteItem(params).promise();
};

module.exports = {
  writeDB,
};
