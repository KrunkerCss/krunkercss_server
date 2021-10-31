const router = require("express").Router();
const CssModel = require("../db/models/css");
const { jwt_check } = require("../middlewares/auth");
const { allowFirstLevel } = require("../middlewares/role");
const { actionDTypes } = require("../routes_types/request");
const { HandleError, NOTFOUND } = require("../utils/error");
const { push_n } = require("../utils/notification");

router.get("/", jwt_check, allowFirstLevel, async (req, res) => {
  try {
    const css = await CssModel.find({
      approved: false,
      need_action: false,
    }).populate("user", ["name", "username"]);

    return res.status(200).json({ success: true, css });
  } catch (err) {
    return HandleError(err, res);
  }
});

router.post(
  "/action",
  jwt_check,
  allowFirstLevel,
  actionDTypes,
  async (req, res) => {
    try {
      const data = req.body;

      if (data.action_name === "approve") {
        if (data.action_type === "css") {
          const obj = await CssModel.findById(data.action_id);
          if (!obj) throw new NOTFOUND("CSS");
          await CssModel.findByIdAndUpdate(data.action_id, {
            approved: true,
            need_action: false,
          });
          // Notification stuff
          await push_n({
            for: obj.user,
            from: req.user.name,
            title: `${obj.base.name} css approved`,
          });
        }
      } else if (data.action_name === "remove") {
        if (data.action_type === "css") {
          const obj = await CssModel.findById(data.action_id);
          if (!obj) throw new NOTFOUND("CSS");
          await obj.remove();
          // Notification stuff
          await push_n({
            for: obj.user,
            from: req.user.name,
            title: `${obj.base.name} css removed`,
            reason: data.action_reason,
          });
        }
      } else if (data.action_name === "disapprove") {
        const obj = await CssModel.findById(data.action_id);
        if (!obj) throw new NOTFOUND("CSS");
        await CssModel.findByIdAndUpdate(data.action_id, {
          approved: false,
          need_action: true,
        });
        // Notification stuff
        await push_n({
          for: obj.user,
          from: req.user.name,
          title: `Need action for ${obj.base.name} css`,
          reason: data.action_reason,
        });
      }

      return res.status(200).json({ success: true });
    } catch (err) {
      return HandleError(err, res);
    }
  }
);

module.exports = router;
