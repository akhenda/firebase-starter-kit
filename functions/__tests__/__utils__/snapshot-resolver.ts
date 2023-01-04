module.exports = {
  /** resolves from test to snapshot path */
  resolveSnapshotPath: (testPath: string, snapshotExtension: string) => {
    return testPath.replace('src/', '__snapshots__/') + snapshotExtension;
  },

  /** resolves from snapshot to test path */
  resolveTestPath: (snapshotFilePath: string, snapshotExtension: string) => {
    return snapshotFilePath.replace('__snapshots__/', 'src/').slice(0, -snapshotExtension.length);
  },

  testPathForConsistencyCheck: 'some/__tests__/example.test.js',
};
