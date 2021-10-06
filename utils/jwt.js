const Jwt = require("jsonwebtoken");

const create_access_token = (payload) => {
  return Jwt.sign(payload, process.env.TOKEN_SECRET, { expiresIn: "24h" });
};

const verfiy_access_token = (token) => {
  return Jwt.verify(token, process.env.TOKEN_SECRET);
};

module.exports = { create_access_token, verfiy_access_token };
