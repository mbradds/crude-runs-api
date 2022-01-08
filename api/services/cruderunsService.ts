import { CosmosClient } from "@azure/cosmos";

// Set connection string from CONNECTION_STRING value in local.settings.json
const CONNECTION_STRING = process.env.CONNECTION_STRING;

const cruderunService = {
  init() {
    try {
      this.client = new CosmosClient(CONNECTION_STRING);
      this.database = this.client.database("cer-crude-runs"); // TODO: get these text values from ../../cosmos-db/config.js
      this.container = this.database.container("weekly-crude-runs");
    } catch (err) {
      console.log(err.message);
    }
  },
  async read(region): Promise<string> {
    const columns = `c.WeekEnd, c.WeekEndLastYr, c.RegionEN, c.RegionFR, c.Capacity, c.RunsForWeekEnding, c.PctCapUsed, c.FourWkAvg, c.FourWkAvgLastYr, c.YTDAvg, c.YTDAvgLastYr`;
    let query = `select ${columns} from c`;
    if (region) {
      query += ` where c.RegionEN = "${region}"`;
    }
    const iterator = this.container.items.query(query);
    const { resources } = await iterator.fetchAll();
    return JSON.stringify(resources);
  },
};

cruderunService.init();

export default cruderunService;
