module.exports = async function setup() {
  process.env = Object.assign(process.env, {
    EXAMPLE_ENV_VAR: 'currently_not_used_anywhere',
  });
};
