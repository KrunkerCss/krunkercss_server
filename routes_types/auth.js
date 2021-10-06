const dry = require("express-dry");

const loginDTypes = dry.body({
  username: { type: String, required: true },
  password: { type: String, required: true },
});

const registerDTypes = dry.body({
  name: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
});

module.exports = {
  loginDTypes,
  registerDTypes,
};
