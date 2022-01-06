// @ts-check

const config = {
  endpoint: "",
  key: "",
  databaseId: "cer-crude-runs",
  containerId: "weekly-crude-runs",
  partitionKey: { kind: "Hash", paths: ["/pk"] },
};

module.exports = config;
