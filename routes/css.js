const router = require("express").Router();
const { HandleError, EXISTS, NOTFOUND, BAD } = require("../utils/error");
const CssModel = require("../db/models/css");
const UserModel = require("../db/models/user");
const { jwt_check, jwt_partial_check } = require("../middlewares/auth");
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

router.get("/:name", jwt_partial_check, async (req, res) => {
  try {
    let query = { "base.name": req.params.name };
    if (req.user) {
      if (!(req.user.role === "admin" || req.user.role === "mod")) {
        query = {
          ...query,
          $or: [
            {
              user: req.user.id,
            },
            {
              approved: true,
            },
          ],
        };
      }
    } else {
      query = { ...query, approved: true };
    }
    const css = await CssModel.findOne(query).populate("user", [
      "id",
      "username",
      "name",
    ]);
    return res.status(200).json({ success: true, css });
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

      const cssOwner = req.user.username === css.user.username;
      const isAdmin = req.user.role === admin[0];
      const isMod = req.user.role === mod[0];
      const isAdminCSS = css.user.role === admin[0];
      const isModCSS = css.user.role === mod[0];

      let pass = false;
      if (
        cssOwner ||
        (isAdmin && !isAdminCSS) ||
        (isMod && !isModCSS && !isAdminCSS)
      ) {
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
