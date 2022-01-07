const sql = require("mssql/msnodesqlv8");

async function getCerData() {
  try {
    const pool = new sql.ConnectionPool({
      server: "tsql23cap",
      database: "Regulatory_Untrusted",
      options: {
        trustedConnection: true,
      },
    });

    let conn = await pool.connect();
    const request = new sql.Request(pool);
    const query = `SELECT cast([PublicRegionalReportId] as nvarchar(8)) as id
        ,[WeekEnd]
        ,[WeekEndLastYr]
        ,[RegionEN]
        ,[RegionFR]
        ,[Capacity]
        ,[RunsForWeekEnding]
        ,[PctCapUsed]
        ,[FourWkAvg]
        ,[FourWkAvgLastYr]
        ,[YTDAvg]
        ,[YTDAvgLastYr]
        FROM [Regulatory_Untrusted].[_WCR].[PublicRegionalReport]`;

    const result = await request.query(query);
    await conn.close();
    return result;
  } catch (err) {
    console.log(err);
  }
}

module.exports = { getCerData };
