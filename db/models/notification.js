const { Schema, model, SchemaTypes } = require("mongoose");

const notification = Schema({
  from: { type: SchemaTypes.ObjectId, ref: "user" },
  for: { type: SchemaTypes.ObjectId, ref: "user" },
  read: { type: Boolean, default: false },
  title: { type: String, required: true },
  reason: { type: String },
});

module.exports = model("notification", notification);
