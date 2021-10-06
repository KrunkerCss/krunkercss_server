const { HandleError, BAD } = require("../utils/error");
const Roles = require("../utils/role");

const allow = (roles = []) => {
  return (req, res, next) => {
    try {
      if (roles.length === 0) next();

      const exists = roles.find((item) => item === req.user.role);
      if (!exists) throw new BAD("user");

      next();
    } catch (err) {
      return HandleError(err, res);
    }
  };
};

const allowAll = allow(Roles.all);

const allowFirstLevel = allow(Roles.first_level);

const allowSecondLevel = allow(Roles.second_level);

const allowAdmin = allow(Roles.admin);

const allowMod = allow(Roles.mod);

const allowCssMaker = allow(Roles.css_maker);

const allowUser = allow(Roles.user);

module.exports = {
  allow,
  allowAll,
  allowFirstLevel,
  allowSecondLevel,
  allowAdmin,
  allowMod,
  allowCssMaker,
  allowUser,
};
