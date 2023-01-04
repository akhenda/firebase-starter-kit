module.exports = async function teardown() {
  delete process.env.EXAMPLE_ENV_VAR;
};
