const sql = require('mssql/msnodesqlv8')

async function getCerData() {
    try {
        const pool = new sql.ConnectionPool({
            server: "tsql23cap",
            database: "Regulatory_Untrusted",
            options: {
              trustedConnection: true
            }
        });
        
        await pool.connect();
        const request = new sql.Request(pool);
        const query = `SELECT [PublicRegionalReportId]
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
        return result
    } catch (err) {
        console.log(err)
    }
}

module.exports = { getCerData };
