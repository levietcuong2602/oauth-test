```
  ___    _         _   _       ____    ___
 / _ \  / \  _   _| |_| |__   |___ \  / _ \
| | | |/ _ \| | | | __| '_ \    __) || | | |
| |_| / ___ \ |_| | |_| | | |  / __/ | |_| |
 \___/_/   \_\__,_|\__|_| |_| |_____(_)___/

```

<a id='top'></a>

# Table of Contents

1. [Installation and Setup](#install)
2. [Tech stacks](#tech-stacks)
3. [Flows](#flow)
   - [General Integration Flow](#intergration-flow)
   - [Authorization Code Grant]
     - [0. Overview](#flow-overview)
     - [1. Authorization](#flow-authorization)
     - [2. Token](#flow-token)
     - [3. Authentication](#flow-authentication)
   - Refresh Token
     - [0. Overview](#refresh-overview)

<a id='install'></a>

# Installation and Setup

1. Clone this Repo
2. `cd` into the project root folder, and run `yarn`
   - If `yarn` is not installed, install it and then run `yarn`
3. cp env.default .env and update environment data properly
4. For this to work, you are going have to hack this a little bit:
   - navigate to the node_modules folder
   - find the oauth_server folder. (node_modules/express-oauth-server/node_modules/oauth2-server)
   - open lib/handlers/authorize-handler.js
   - Make the following change (around line 136):
     AuthorizeHandler.prototype.generateAuthorizationCode = function (client, user, scope) {
     if (this.model.generateAuthorizationCode) {
     // Replace this
     //return promisify(this.model.generateAuthorizationCode).call(this.model, client, user, scope);
     // With this
     return this.model.generateAuthorizationCode(client, user, scope)
     }
     return tokenUtil.generateRandomToken();
     };
5. Run `yarn postinstall` to fix lib express-oauth-server
6. Run `yarn migrate` to migrate database
7. Run `yarn seed` to insert data to database
8. Run `yarn authServer` to boot up the oauth 2.0 server
9. Run `yarn devAuth` to boot up the oauth 2.0 server in dev mode. This will enable hot reloading when your code changes.
10. Run `yarn test` to run unit tests that cover all implemented grants
    - For verbose output, modify `level` in `auth/tests/setup.js` to be `DebugControl.levels.ALL`

[back](#top)

# Tech stacks

<a id='tech-stack'></a>

- Nodejs 14.x++
- Mysql 8.0
- Redis 5.x++
- Documents API: ${domain_url}/api-docs

# Integration FLow

<a id='intergration-flow'></a>
![Protected Resources](/resources/images/sso.png)

First, some definitions and reminders:

- _Client_: The application wanting to have access to your resources
- _User_: The person wanting to use your resources on the Client
- _Authorization_: The process of determining whether something has access to protected resources
- _Authentication_: The process of determining a person's identity.
- _OAuth2.0_: A protocol outlining how authorization should happen. It is NOT an authentication library. You will need to provide that yourself.

Each of the grants provide a token which enables the user to access resources like the following diagram shows:

1. Token is passed up in the authorization header
2. Oauth Server validates the token
3. Protected Resources are sent back down

![Protected Resources](/resources/images/ProtectedResources.png)

[back](#top)

### Authorization Code Grant

##### 0. Overview

Aight, with those out of the way, we need to cover the basic flow with the authorization code grant.

1. Authorization
   - Client application contacts the Server and requests access
   - Client application provides a client_id (unique string identifier)
   - Client provides a redirect uri to send the user after the code is delivered
   - Client may provide user data for authentication purposes
   - Server validates information and sends back an authorization code
2. Token
   - Client uses received authorization code to request a token
   - Client sends client_id, client_secret (if applicable)
   - Server validates request, and sends a token.
3. Authentication
   - Client uses token to gain access to Server's protected resources

![Authorization Code Grant Flow](/resources/images/AuthorizationCode.png)

In the OAuth2.0 library, each of the above areas are handled within
dedicated urls. Specific details on how to handle the different things
are added to the `model` object within the OAuth server.

Now, we will explore each of the above 3 areas in depth.

[back](#top)

<a id='flow-authorization'></a>

##### 1. Authorization

After hitting the Authorization url, the following calls are made within
the model object in this order:

1. `getClient`: This will extract the `client_id` from the request's query or body parameter. You can then go through and verify that the client is indeed a good client, what redirects are permitted for the Client, and what grants they have access to (in this example, just 'authorization_code'). Upon verification, return a valid Client object.
   - After calling `getClient`, if you passed an `authenticateHandler` to the `authorize` method call, this will then be called. If you return some non-falsy object, that object will be the User and will assume the User was able to authenticate. If you return a falsy object, we will assume that the user failed to authenticate, and must be booted. So, in short, this is where you authenticate the user.
2. `saveAuthorizationCode`: This will give you an authorization code, the retrieved Client Object from `getClient`, and the user from the `authenticateHandler`. This information needs to be stored in your database. Once stored, return the information

After making the above calls, the server redirects you to the provided `redirect_uri` with the authorization code present as a url query parameter.

[back](#top)

<a id='flow-token'></a>

##### 2. Token

After hitting the token url, the following calls are made within the model object in this order:

1. `getClient`: Same as before, but will now allow you set the `client_secret` to ensure the client is a valid client.
2. `getAuthorizationCode`: using the `authorizationCode` the client provides, look up in the database for the client, user, and code information for that code, and return it. If none, return false to stop the request as it is invalid.
3. `revokeAuthorizationCode`: using the `authorizationCode` the client provides, delete from the database where the code exists. Return true if the code was deleted, false otherwise. Each authorization code can only be used once.
4. `generateAccessToken (optional)`: using the client and user provided, generate an access token. If not provided, the library will use its in-built library to generate a token. If you want to use JWTs, this is where that would happen.
5. `saveToken`: using the client, code, and token generated earlier, save this information in the database.

The token is then sent as a json response like this:

```js
{
    access_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbGllbnQiOnsiaWQiOjMsIm5hbWUiOm51bGwsImNsaWVudElkIjoiTWFya2V0UGxhY2UxIiwiY2xpZW50U2VjcmV0IjoiZjcwZmU2YjItY2Y2MC00ZmI1LTk5OGEtZmI4NzQ1YTViZDRkIiwicmVkaXJlY3RVcmlzIjpbImh0dHA6Ly9sb2NhbGhvc3Q6MzAzMC9jbGllbnQvYXBwIl0sImdyYW50cyI6WyJhdXRob3JpemF0aW9uX2NvZGUiLCJyZWZyZXNoX3Rva2VuIl19LCJ1c2VyIjp7ImlkIjoxLCJ1c2VybmFtZSI6ImN1b25nbHYiLCJwYXNzd29yZCI6Ijc4OTZkNWJmZTM4YzkwZDEyNGRhZGNjY2ZlMDhiMjkwOjhkYjZhZDFjODBiNTE2ZWE0NGRkYmNkNTRmYTViMDQ3MmFkMmYxYjYyZWU5MDBmYjNlMmExYzA2NWI5ODM3NWIzZTE0YWNjOGUzNWM5MmVkYTI2ZjdkNTM2NDYwODQ4MDQ2MDFjY2VmOTNjMTFiNjg3MjE0ZGVlYiIsIndhbGxldEFkZHJlc3MiOm51bGx9LCJpYXQiOjE2NDg4MDkzODIsImV4cCI6MTY0ODgwOTM4M30._BEQRdhSgvjzTvjb5ExgLrQtEHtnaru9VhZUoj_Il-4",
    expires_in: 1209599,
    refresh_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbGllbnQiOnsiaWQiOjMsIm5hbWUiOm51bGwsImNsaWVudElkIjoiTWFya2V0UGxhY2UxIiwiY2xpZW50U2VjcmV0IjoiZjcwZmU2YjItY2Y2MC00ZmI1LTk5OGEtZmI4NzQ1YTViZDRkIiwicmVkaXJlY3RVcmlzIjpbImh0dHA6Ly9sb2NhbGhvc3Q6MzAzMC9jbGllbnQvYXBwIl0sImdyYW50cyI6WyJhdXRob3JpemF0aW9uX2NvZGUiLCJyZWZyZXNoX3Rva2VuIl19LCJ1c2VyIjp7ImlkIjoxLCJ1c2VybmFtZSI6ImN1b25nbHYiLCJwYXNzd29yZCI6Ijc4OTZkNWJmZTM4YzkwZDEyNGRhZGNjY2ZlMDhiMjkwOjhkYjZhZDFjODBiNTE2ZWE0NGRkYmNkNTRmYTViMDQ3MmFkMmYxYjYyZWU5MDBmYjNlMmExYzA2NWI5ODM3NWIzZTE0YWNjOGUzNWM5MmVkYTI2ZjdkNTM2NDYwODQ4MDQ2MDFjY2VmOTNjMTFiNjg3MjE0ZGVlYiIsIndhbGxldEFkZHJlc3MiOm51bGx9LCJpYXQiOjE2NDg4MDkzODIsImV4cCI6MTY0ODgwOTk4Nn0.E2sE7UzUf4E6H027Da6EPS9_teTWiaxdQU0nemgeeyk",
    token_type: "Bearer"
}
```

[back](#top)

<a id='flow-authentication'></a>

##### 3. Authentication

Use the token type and token code to add an authorization header like this: `${token_type $token_code}`. This will allow the token to be transmitted securely.

After hitting an authenticate url, the following calls are made within the model object in this order:

1. `getAccessToken`: using the token code provided by the client, return the token, client, and user associated with the token code. If not valid, return false.

If you want to access this information in your routes, it is found in `res.locals.oauth.token`, so you immediately have access to the client and user information associated with the token.

[back](#top)

<a id='refresh-overview'></a>

### Refresh

##### Overview

The refresh token flow is one of the simplest of the grants. After any successful grant flow is completed and a token is generated, a refresh token is created along-side. If the refresh token is then returned with the other information, the client will be able to use the `refresh_token` with its `client_id`, `client_secret`, and `grant_type` of refresh_token in a post to the /token route to get access to a new valid token.

![Refresh Token Gran](/resources/images/RefreshToken.png)
