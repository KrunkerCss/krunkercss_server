const { Schema, model } = require("mongoose");

const user = Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true, default: "user" },
});

module.exports = model("user", user);
