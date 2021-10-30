const { Schema, model, SchemaTypes } = require("mongoose");

const css = Schema({
  approved: { type: Boolean, default: false },
  user: { type: SchemaTypes.ObjectId, ref: "user", required: true },
  base: {
    name: { type: String, unique: true, required: true },
    logo: { type: String, default: "" },
    cover: { type: String, default: "" },
    description: { type: String, default: "" },
    screenshots: [{ type: String }],
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
});

module.exports = model("css", css);
