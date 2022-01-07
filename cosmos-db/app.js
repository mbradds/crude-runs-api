const CosmosClient = require("@azure/cosmos").CosmosClient;
const config = require("./config");
const dbContext = require("./data/databaseContext");
const getCerData = require("./data/getCerData");

async function createAndConnect() {
  const { endpoint, key, databaseId, containerId } = config;
  const client = new CosmosClient({ endpoint, key });

  const database = client.database(databaseId);
  const container = database.container(containerId);
  await dbContext.create(client, databaseId, containerId);
  return { database: database, container: container };
}

async function addData() {
  const data = await getCerData.getCerData();
  const cosmos = await createAndConnect();
  // await cosmos.container.delete();
  try {
    await Promise.all(
      data.recordset.map((itemDef) => cosmos.container.items.upsert(itemDef))
    );
    console.log(data.recordset.length + " items created");
  } catch (err) {
    console.log(err);
  }
}

addData();
