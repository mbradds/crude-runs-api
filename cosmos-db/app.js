const CosmosClient = require("@azure/cosmos").CosmosClient;
const config = require("./config");
const dbContext = require("./data/databaseContext");

// Make sure Tasks database is already setup. If not, create it.
async function main() {
  const { endpoint, key, databaseId, containerId } = config;
  const client = new CosmosClient({ endpoint, key });

  const database = client.database(databaseId);
  const container = database.container(containerId);
  await dbContext.create(client, databaseId, containerId);
}

main();
