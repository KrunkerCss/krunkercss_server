const dry = require("@epicx/express-dry");

const readNotificationDTypes = dry.body(
  {
    read: { type: Boolean, required: true },
    id: { type: dry.Types.ObjectId, required: true },
  },
  { allowExtraKeys: false }
);

const removeNotificationDTypes = dry.body(
  {
    id: { type: dry.Types.ObjectId, required: true },
  },
  { allowExtraKeys: false }
);

module.exports = {
  readNotificationDTypes,
  removeNotificationDTypes,
};
