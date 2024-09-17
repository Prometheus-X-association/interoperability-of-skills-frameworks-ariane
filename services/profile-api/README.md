### Keycloak Helpers
- JWT token generation from keycloak: It will be generated after user login with
[Login method](src/helpers/keycloak.js)
- JWT validation will be handled validated offline with [JWT offline validation method](src/keycloak/validateOffline.js)
- Another helper to generate oneTimeToken (simple token) used for some basic scenario like activating account, or reset password. This oneTimeToken is JWT token which is created with the id of user and being signed with secret key from the `keycloak.account.client-secret` key in configuration file

### Mailjet configuration
- After decrypt the configuration, there will be `mailjet` object that includes `apiKey` and `apiSecret` for setting up mailjet client, and also `sender` as the sender email, which need to be configured from mailjet dashboard.

### Send email
- Make sure Mailjet is configured properly as above.
- Then we can use [sendEmail method](src/helpers/email.js) to send email to user. You can provide email of sender, receiver, subject and html content of the email. The email will be sent asynchronously.
- The html content will be generated from the mjml template, using [mjml](https://mjml.io/) library. The template file is located in [templates folder](src/emailTemplates). Templates can include variables, and can be replaced with json object data using `handlebars` library.
- There is helper to generate html content, just need to provide template string and data object. [compileHtmlContent method](src/helpers/email.js)

### Sign up
- Integrated signup resolver to main graphql server
- As we can see in [signup resolver](src/resolvers/signup.js), we will call keycloak api to create user in keycloak and ES. Arguments list can be found in code or from graphql playground.
- Before creating user, resolver will check if company is existed or not. If not, throw error.
- Then it will check if we provide a directManager id of this new user or not. If not, just skip. If there is, find if there is a user with this id or not. If not, throw error.
- Then check if current user with this email is existed or not in keycloak.
  - If exists, check if this user exists in ES db or not, with status Active.
    - If there is existing profile in ES that is active, throw error that user is existed
    - Or else, the only case is that this same email user just changed his/her company -> Update keycloak data and ES profile data
  - If not exists, create new user in keycloak and ES
- After all the check above, sending a welcome email to new user with oneTimeToken to activate account.
- This email will have a button or an url to the activation link. 
This activation link is defined by `${config.signupCallbackLink}?token=${oneTimeToken}`. `signupCallbackLink` should be configured in config file, and should link to our FE page that will handle the activation process, with the oneTimeToken string created above.
- FE page then must use the token in the url query params to send to server for activation
- Results of the signup resolver will be the user profile id only.

### Activate
- Integrated activate resolver to main graphql server
- As we can see in [activate resolver](src/resolvers/activate.js), we will call keycloak api to activate user in keycloak and ES. Arguments list can be found in code or from graphql playground.
- At first, the resolver will decrypt and validate the oneTimeToken, using the secret key from `keycloak.account.client-secret` key in configuration file (same way it is created).
- Then it will check if current user with this email is existed or not in ES.
  - If exists, check if this user exists in ES db or not
    - If there is existing profile in ES that is active, throw error that user is active
    - If there is existing profile in ES that is not pending, which mean it is inactive -> throw error
    - Last case that this existing profile that is pending, update status to active and finish the resolver
  - If not exists, throw error not found user to activate

### Unit test
- `cd services/profile-api | pnpm run test` to run all the tests