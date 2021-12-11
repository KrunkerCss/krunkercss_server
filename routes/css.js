const router = require("express").Router();
const { HandleError, EXISTS, NOTFOUND, BAD } = require("../utils/error");
const CssModel = require("../db/models/css");
const UserModel = require("../db/models/user");
const { jwt_check } = require("../middlewares/auth");
const { allowSecondLevel } = require("../middlewares/role");
const {
  postCssDTypes,
  putCssDTypes,
  deleteCssDTypes,
} = require("../routes_types/css");
const { admin, mod, css_maker } = require("../utils/role");

router.get("/", async (req, res) => {
  try {
    const css = await CssModel.find({ approved: true }).populate("user", [
      "id",
      "username",
      "name",
    ]);
    return res.status(200).json({ success: true, payload: css });
  } catch (err) {
    return HandleError(err, res);
  }
});

router.post(
  "/",
  jwt_check,
  allowSecondLevel,
  postCssDTypes,
  async (req, res) => {
    try {
      const user = await UserModel.findOne({
        username: req.user.username,
        role: req.user.role,
      });
      if (!user) throw new NOTFOUND("User");

      const need_approval = user.role === css_maker[0];

      const exists = await CssModel.exists({ "base.name": req.body.base.name });
      if (exists) throw new EXISTS(req.body.base.name);

      const Css = new CssModel({
        user: user,
        approved: !need_approval,
        ...req.body,
      });
      await Css.save();

      return res.status(200).json({
        success: true,
        message: `CSS Uploaded.${
          need_approval ? " Waiting for approval." : ""
        }`,
      });
    } catch (err) {
      return HandleError(err, res);
    }
  }
);

router.put("/", jwt_check, allowSecondLevel, putCssDTypes, async (req, res) => {
  try {
    const user = await UserModel.findOne({
      username: req.user.username,
      role: req.user.role,
    });
    if (!user) throw new NOTFOUND("User");

    const need_approval = user.role === css_maker[0];

    if (req.body.prev_name !== req.body.base.name) {
      const exists = await CssModel.findOne({
        "base.name": req.body.base.name,
      });

      if (exists) throw new EXISTS("Another CSS with new name");
    }

    const css = await CssModel.findOneAndUpdate(
      { user: user, "base.name": req.body.prev_name },
      {
        approved: !need_approval,
        base: req.body.base,
        main: req.body.main,
        config: req.body.config,
      }
    );

    if (!css) throw new NOTFOUND("CSS");

    return res.status(200).json({
      success: true,
      message: `CSS Updated.${need_approval ? " Waiting for approval." : ""}`,
    });
  } catch (err) {
    return HandleError(err, res);
  }
});

router.delete(
  "/",
  jwt_check,
  allowSecondLevel,
  deleteCssDTypes,
  async (req, res) => {
    try {
      const data = req.body;
      const user = await UserModel.findOne({
        username: req.user.username,
        role: req.user.role,
      });
      if (!user) throw new NOTFOUND("User");

      const css = await CssModel.findOne({ "base.name": data.name }).populate(
        "user",
        ["username", "role"]
      );
      if (!css) throw new NOTFOUND("Css");

      let pass = false;
      if (css.user.role === admin[0] || css.user.role === mod[0]) {
        pass = true;
      } else if (css.user.username === req.user.username) {
        pass = true;
      }
      if (!pass) throw new BAD("Request");

      await css.remove();

      return res.status(200).json({
        success: true,
        message: "CSS deleted",
      });
    } catch (err) {
      return HandleError(err, res);
    }
  }
);

module.exports = router;
