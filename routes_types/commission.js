const dry = require("@epicx/express-dry");

const postCommissionDTypes = dry.body(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    screenshots: { type: Array },
    pricing: [
      {
        title: { type: String, required: true },
        price: { type: String, required: true },
      },
    ],
  },
  { allowExtraKeys: false }
);

const putCommissionDTypes = dry.body(
  {
    prev_title: { type: String, require: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    screenshots: { type: Array },
    pricing: [
      {
        title: { type: String, required: true },
        price: { type: String, required: true },
      },
    ],
  },
  { allowExtraKeys: false }
);

const deleteCommissionDTypes = dry.body(
  {
    title: { type: String, require: true },
    reason: { type: String, require: true },
  },
  { allowExtraKeys: false }
);

module.exports = {
  postCommissionDTypes,
  putCommissionDTypes,
  deleteCommissionDTypes,
};
