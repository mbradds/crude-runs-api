/**
 * API Documentation:
 * GET Western Canada, all columns: http://localhost:7071/api/cruderuns/Western%20Canada
 * GET Western Canada, some columns: http://localhost:7071/api/cruderuns/Western%20Canada?cols=[WeekEnd,Capacity,RunsForWeekEnding,PctCapUsed]
 */

import { Container, CosmosClient, Database } from "@azure/cosmos";

// Set connection string from CONNECTION_STRING value in local.settings.json
const CONNECTION_STRING = process.env.CONNECTION_STRING;

const allColumns = [
  "WeekEnd",
  "WeekEndLastYr",
  "RegionEN",
  "RegionFR",
  "Capacity",
  "RunsForWeekEnding",
  "PctCapUsed",
  "FourWkAvg",
  "FourWkAvgLastYr",
  "YTDAvg",
  "YTDAvgLastYr",
];

const validateRegion = (region?: string) => {
  const possibleRegions = [
    "Western Canada",
    "Ontario",
    "Quebec & Eastern Canada",
  ];

  if (region) {
    if (possibleRegions.includes(region)) {
      return region;
    } else {
      throw Error(`Specified region "${region}" not found`);
    }
  }

  return undefined;
};

/**
 * Validate user defined columns from `?cols=` query param
 * @param userEnteredCols
 * @returns array of invalid column names or empty array if valid
 */
const columnErrors = (userEnteredCols: string[]) => {
  return userEnteredCols
    .map((col) => {
      if (allColumns.includes(col)) {
        return null;
      }
      return col;
    })
    .filter(function (el) {
      return el != null;
    });
};

// TODO: Add column validation (potentially with joi)

const validateCols = (cols?: string) => {
  if (!cols) {
    return undefined;
  }

  // String array to js array
  const colArray = cols.replace(/\[|\]/g, "").split(",");
  const notFoundCols = columnErrors(colArray);
  if (notFoundCols.length >= 1) {
    throw Error(`Columns ${JSON.stringify(notFoundCols)} not found`);
  }

  // Convert array to csv with `c.` prefix on members
  return colArray.map((i) => `c.${i}`).join(", ");
};

/**
 *
 * @param cols User defined columns from `?cols=` query param
 * @returns
 */
const columnGenerator = (cols?: string) => {
  if (!cols) {
    return allColumns.map((col) => `c.${col}`).join();
  }
  return cols;
};

const queryGenerator = (region?: string, cols?: string) => {
  let query = `select ${columnGenerator(cols)} from c`;
  if (region) {
    query += ` where c.RegionEN = "${region}"`;
  }
  return query;
};

export class CrudeRunsService {
  private client: CosmosClient;
  private database: Database;
  private container: Container;

  constructor() {
    if (!CONNECTION_STRING) {
      throw Error("Cosmos connection string not provided");
    }

    this.client = new CosmosClient(CONNECTION_STRING);
    this.database = this.client.database("cer-crude-runs"); // TODO: get these text values from ../../cosmos-db/config.js
    this.container = this.database.container("weekly-crude-runs");
  }

  async read(region?: string, cols?: string): Promise<string> {
    const validRegion = validateRegion(region);
    const validCols = validateCols(cols);

    const query = queryGenerator(validRegion, validCols);
    const iterator = this.container.items.query(query);
    const { resources } = await iterator.fetchAll();
    return JSON.stringify(resources);
  }
}

const crudeRunsService = () => new CrudeRunsService();

export default crudeRunsService;
