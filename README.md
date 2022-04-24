# Aizon sample NodeJS API

This sample application is an API using AWS Serverless architecture and the following services:

- API Gateway
- DynamoDB
- Lambda
- Cognito
- Cloudformation

![architecture](/images/aizon-api-architecture.png)

# Requirements

- [Node.js 10 with npm](https://nodejs.org/en/download/releases/)
- The Bash shell. For Linux and macOS, this is included by default. In Windows 10, you can install the [Windows Subsystem for Linux](https://docs.microsoft.com/en-us/windows/wsl/install-win10) to get a Windows-integrated version of Ubuntu and Bash.
- [The AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html) v1.17 or newer with valid credentials configured.

# Setup

Run `npm install`

Run `src/1-create-bucket.sh`. A bucked named `artifacts-aizon-api` will be created and saved in `bucket-name.txt` for future use.

Run `src/2-deploy.sh`. The cloudformation template will be packaged and deployed to AWS.

# Creating an admin user

Create a .env file in `admin/.env` with the following configuration:

    AWS_REGION={{YOUR_AWS_REGION}}
    AWS_COGNITO_POOL_ID={{YOUR_AWS_ADMIN_POOL_ID}}
    AWS_COGNITO_APP_CLIENT={{YOUR_AWS_ADMIN_POOl_APP_CLIENT_ID}}
    AWS_COGNITO_APP_SECRET={{YOUR_AWS_ADMIN_POOl_APP_CLIENT_SECRET}}
    AWS_ADMIN_USER={{YOUR_AWS_ADMIN_EMAIL}}
    AWS_ADMIN_PASSWD={{YOUR_AWS_ADMIN_PASSWORD}}

Run `bash createUser.sh`

Run `bash getAdminToken.sh`. `admin/tokenId.json` file will be generated. Auth token will be valid only for 1 hour. This token could be used for managing solutions/screens/widgets.

# Creating a client user

Configure `client/logIn.js`:

    USERNAME = {{YOUR_CLIENT_USERNAME}};
    TEMP_PASSWORD = "Abc@321";
    PASSWORD = {{YOUR_CLIENT_PASSWORD}};
    poolData {
        UserPoolId: {{YOUR_AWS_CLIENT_POOL_ID}},
        ClientId: {{YOUR_AWS_CLIENT_POOL_APP_CLIENT_ID}}, // App client id here
    }

Run `node logIn.js true`. `client/tokenId.json` file will be generated. Auth token will be valid only for 1 hour. This token could be used for getting full clients solutions data. (true param indicates that will use temporal password. After first run, you must not pass the param)

# Using the API

### Admin API

> You must add `Authorization` header with a valid admin IdToken. POST/PATCH/DELETE request must have a JSON body with required keys (listed below). GET request must have null body

> Owner must be a valid cognito client username

- /users

  - POST. Creates a new client user. Keys REQUIRED: email.
  - DELETE. Deletes an existing client user. Keys REQUIRED: email.

- /solutions

  - POST. Creates a new solution. Keys REQUIRED: name, owner. OPTIONAL: desc, icon.
  - GET. Returns all solutions.
  - PATCH. Modifies an existing solution. Keys REQUIRED: id, name, owner. OPTIONAL: desc, icon.
  - DELETE. Deletes an existing solution. Keys REQUIRED: id, owner.

- /screens
  - POST. Creates a new screen, owned by a solution. Keys REQUIRED: name, solution_id. OPTIONAL: desc, icon.
  - GET. Returns all screens.
  - PATCH. Modifies an existing screen. Keys REQUIRED: id, name, solution_id. OPTIONAL: desc, icon.
  - DELETE. Deletes an existing solution. Keys REQUIRED: id, solution_id.
- /widgets
  - POST. Creates a new widget, owned by a screen. Keys REQUIRED: name, screen_id, data. OPTIONAL: desc, icon.
  - GET. Returns all widgets.
  - PATCH. Modifies an existing widget. Keys REQUIRED: id, name, screen_id, data. OPTIONAL: desc, icon.
  - DELETE. Deletes an existing widget. Keys REQUIRED: id, screen_id.

### Client API

> You must add `Authorization` header with a valid client IdToken. GET request must have null body

- /solutions

  - GET. Returns all solutions, screens and widgets that belongs to the invoking client IdToken.

# Tests

![unit-admin](/images/unit-test-admin.png)
![unit-client](/images/unit-test-clients.png)
![e2e-admin](/images/e2e-admin.png)
![e2e-full](/images/e2e-full.png)
