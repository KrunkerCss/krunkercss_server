const { Schema, model, SchemaTypes } = require("mongoose");

const commission = Schema({
  approved: { type: Boolean, default: false },
  user: { type: SchemaTypes.ObjectId, ref: "user", required: true },
  screenshots: [{ type: String }],
  title: { type: String, required: true },
  description: { type: String, required: true },
  pricing: [
    {
      title: { type: String, required: true },
      price: { type: String, required: true },
    },
  ],
});

module.exports = model("commission", commission);
