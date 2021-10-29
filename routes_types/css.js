const dry = require("@epicx/express-dry");

const postCssDTypes = dry.body(
  {
    base: {
      name: { type: String, required: true },
      logo: { type: String, default: "" },
      cover: { type: String, default: "" },
      description: { type: String, default: "" },
      screenshots: { type: Array },
      pricing: [
        {
          name: { type: String, required: true },
          price: { type: Number, default: 0 },
        },
      ],
      repo: { type: String, default: "" },
      site: { type: String, default: "" },
      credits: [
        {
          name: { type: String, required: true },
          contacts: [
            {
              contact_type: { type: String, required: true },
              link: { type: String, required: true },
            },
          ],
        },
      ],
    },
    main: { type: String, default: "" },
    configs: { type: String, default: "" },
  },
  { allowExtraKeys: false }
);

const putCssDTypes = dry.body(
  {
    prev_name: { type: String, require: true },
    base: {
      name: { type: String, required: true },
      logo: { type: String, default: "" },
      cover: { type: String, default: "" },
      description: { type: String, default: "" },
      screenshots: { type: Array },
      pricing: [
        {
          name: { type: String, required: true },
          price: { type: Number, default: 0 },
        },
      ],
      repo: { type: String, default: "" },
      site: { type: String, default: "" },
      credits: [
        {
          name: { type: String, required: true },
          contacts: [
            {
              contact_type: { type: String, required: true },
              link: { type: String, required: true },
            },
          ],
        },
      ],
    },
    main: { type: String, default: "" },
    configs: { type: String, default: "" },
  },
  { allowExtraKeys: false }
);

const deleteCssDTypes = dry.body(
  {
    name: { type: String, require: true },
    reason: { type: String, require: true },
  },
  { allowExtraKeys: false }
);

module.exports = {
  postCssDTypes,
  putCssDTypes,
  deleteCssDTypes,
};
