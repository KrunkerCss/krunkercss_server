const router = require("express").Router();
const UserModel = require("../db/models/user");
const { jwt_check } = require("../middlewares/auth");
const { allowAdmin, allowSecondLevel } = require("../middlewares/role");
const { second_level, admin, mod, css_maker, all } = require("../utils/role");
const roles = require("../utils/role");
const { HandleError, NOTFOUND, ERROR, INVALID } = require("../utils/error");
const { searchUserDTypes, changeUserDTypes } = require("../routes_types/user");
const { push_n } = require("../utils/notification");

/*
promote user
demote user
search user
*/

const roleFilter = second_level.map((item) => ({ role: item }));

router.get("/", jwt_check, allowSecondLevel, async (req, res) => {
  try {
    const users = await UserModel.find({ $or: roleFilter }).select("-password");
    return res.status(200).json({ success: true, users });
  } catch (err) {
    return HandleError(err, res);
  }
});

router.get(
  "/search",
  jwt_check,
  allowAdmin,
  searchUserDTypes,
  async (req, res) => {
    try {
      const user = await UserModel.findOne({
        username: req.body.username,
        $not: { role: "admin" },
      }).select("-password");
      if (!user) throw new NOTFOUND("User");

      return res.status(200).json({ success: true, user });
    } catch (err) {
      return HandleError(err, res);
    }
  }
);

router.post(
  "/change",
  jwt_check,
  allowAdmin,
  changeUserDTypes,
  async (req, res) => {
    try {
      const to = req.body.to.toLowerCase().trim();
      const allowed = [...admin, ...mod, ...css_maker, ...roles.user].find(
        (item) => item === to
      );
      if (!allowed) throw new INVALID("Role");

      const adminX = await UserModel.findOne({
        username: req.user.username,
        role: admin[0],
      });
      if (!adminX) throw new ERROR("You are not allowed execute this action");

      const user = await UserModel.findOne({ username: req.body.username });
      if (!user) throw new NOTFOUND("User");
      if (user.role === admin[0])
        throw new ERROR(
          "Given user is an admin. Admins can't promote/demote admins."
        );
      if (user.role === to) throw new ERROR("Same role given");

      const promote =
        all.findIndex((item) => item === to) <
        all.findIndex((item) => item === user.role);

      user.role = to;
      await user.save();

      await push_n({
        from: req.user.name,
        for: user,
        title: `You are ${promote ? "pro" : "de"}moted to ${to}.${
          promote
            ? " Relogin your account to use " + to + " specific features."
            : ""
        }`,
        reason: "",
      });

      return res.status(200).json({ success: true });
    } catch (err) {
      return HandleError(err, res);
    }
  }
);

module.exports = router;
