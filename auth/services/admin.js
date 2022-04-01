const clientDao = require("../daos/client");
const { generateSecurityKey } = require("../utilities/security");

const createClient = async ({ clientId, grants = [], redirectUris = [] }) => {
  const clientExists = await clientDao.findClient({ clientId });
  if (clientExists)
    throw new Error("Client already exists with same client_id");

  const data = {
    clientId,
    grants: JSON.stringify(grants),
    redirectUris: JSON.stringify(redirectUris),
    clientSecret: generateSecurityKey(),
  };

  const newClient = await clientDao.createClient(data);
  return newClient;
};

module.exports = { createClient };
