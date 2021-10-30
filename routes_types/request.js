const dry = require("@epicx/express-dry");

const actionDTypes = dry.body(
  {
    action_name: { type: String, require: true },
    action_type: { type: String, require: true },
    action_id: { type: String, require: true },
    action_reason: { type: String, require: true },
  },
  { allowExtraKeys: false }
);

module.exports = {
  actionDTypes,
};
