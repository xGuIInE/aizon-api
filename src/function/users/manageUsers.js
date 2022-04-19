const createUser = async function (email, context) {
  const { USER_POOL_ID, adminEmail, cognitoIdentityServiceProvider } = context;
  const userData = {
    UserPoolId: USER_POOL_ID,
    Username: email,
    DesiredDeliveryMediums: ["EMAIL"],
    TemporaryPassword: "Abc@321",
    UserAttributes: [
      {
        Name: "email",
        Value: email,
      },
      {
        Name: "email_verified",
        Value: "true",
      },
    ],
  };

  await cognitoIdentityServiceProvider.adminCreateUser(userData).promise();
  console.log(`Admin ${adminEmail} created user: ${email}`);
};

const deleteUser = async function (email, context) {
  const { USER_POOL_ID, adminEmail, cognitoIdentityServiceProvider } = context;

  await cognitoIdentityServiceProvider
    .adminDeleteUser({
      UserPoolId: USER_POOL_ID,
      Username: email,
    })
    .promise();

  console.log(`Admin ${adminEmail} deleted user: ${email}`);
};

module.exports = { deleteUser, createUser };
