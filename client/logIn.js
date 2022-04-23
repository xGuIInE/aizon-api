const AmazonCognitoIdentity = require("amazon-cognito-identity-js");
const fs = require("fs");
//////////////////////
// CONFIG
//////////////////////
const USERNAME = "guine0123@gmail.com";
const TEMP_PASSWORD = "Abc@321";
const PASSWORD = "A123a123";
const poolData = {
  UserPoolId: "eu-west-1_hNNXbFVCs", // User pool id here
  ClientId: "75abthmjioomprjrra50pup870", // App client id here
};
/////////////////////////////////////////////

function logIn() {
  const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
  const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(
    {
      Username: "guine0123@gmail.com",
      Password: process.argv[2] === "true" ? TEMP_PASSWORD : PASSWORD,
    }
  );

  const userData = {
    Username: USERNAME,
    Pool: userPool,
  };
  const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
  cognitoUser.authenticateUser(authenticationDetails, {
    onSuccess: (result) => {
      fs.writeFileSync(
        "./tokenId.json",
        JSON.stringify({
          tokenId: result.getIdToken().getJwtToken(),
        })
      );
      console.log("Token id saved");
    },
    onFailure: (err) => {
      console.log(err);
    },
    newPasswordRequired: () => {
      console.log("Changing password...");
      cognitoUser.completeNewPasswordChallenge(PASSWORD, null, {
        onSuccess: (session) => {
          fs.writeFileSync(
            "./tokenId.json",
            JSON.stringify({
              tokenId: result.getIdToken().getJwtToken(),
            })
          );
          console.log("Token id saved");
        },
        onFailure: (error) => {
          console.log(error);
        },
      });
    },
  });
}

logIn();
