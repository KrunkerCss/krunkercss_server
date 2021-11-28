const dry = require("@epicx/express-dry");

const searchUserDTypes = dry.body(
  {
    username: { type: String, require: true },
  },
  { allowExtraKeys: false }
);

const changeUserDTypes = dry.body(
  {
    username: { type: String, require: true },
    to: { type: String, require: true },
  },
  { allowExtraKeys: false }
);

module.exports = {
  searchUserDTypes,
  changeUserDTypes,
};
