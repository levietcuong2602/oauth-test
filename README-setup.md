1. [Installation and Setup](#install)
2. For this to work, you are going have to hack this a little bit:
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
3. cp env.default .env
4. Run project: yarn devAuth
