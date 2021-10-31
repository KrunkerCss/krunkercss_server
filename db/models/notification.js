const { Schema, model, SchemaTypes } = require("mongoose");

const notification = Schema({
  from: { type: String, required: true },
  for: { type: SchemaTypes.ObjectId, ref: "user", required: true },
  read: { type: Boolean, default: false },
  title: { type: String, required: true },
  reason: { type: String },
});

module.exports = model("notification", notification);
