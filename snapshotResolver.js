const path = require("path");

module.exports = {
  resolveSnapshotPath: (testPath, snapshotExtension) =>
    (testPath + snapshotExtension).replace(__dirname, "__snapshots__"),
  resolveTestPath: (snapshotFilePath, snapshotExtension) =>
    snapshotFilePath
      .replace(snapshotExtension, "")
      .replace("__snapshots__", ""),
  testPathForConsistencyCheck: "components/some.test.js"
};
