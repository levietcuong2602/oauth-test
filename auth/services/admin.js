const clientDao = require("../daos/client");
const { generateSecurityKey } = require("../utilities/security");

const createClient = async ({ name, grants = [], redirectUris = [] }) => {
  const clientExists = await clientDao.findClient({ name });
  if (clientExists) throw new Error("Client already exists with same name");

  const data = {
    grants: JSON.stringify(grants),
    redirectUris: JSON.stringify(redirectUris),
    clientId: generateSecurityKey(),
    clientSecret: generateSecurityKey(),
  };

  const newClient = await clientDao.createClient(data);
  return newClient;
};

module.exports = { createClient };
