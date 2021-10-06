const { HandleError, NOTFOUND } = require("../utils/error");
const { verfiy_access_token } = require("../utils/jwt");

const jwt_check = (req, res, next) => {
  try {
    if (!req.headers.authorization) throw new NOTFOUND("Auth Header");

    const token = req.headers.authorization.split(" ")[1];
    req.user = verfiy_access_token(token);
    next();
  } catch (err) {
    return HandleError(err, res);
  }
};

module.exports = { jwt_check };
