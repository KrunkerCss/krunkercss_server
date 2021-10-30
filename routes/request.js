const router = require("express").Router();
const CssModel = require("../db/models/css");
const { jwt_check } = require("../middlewares/auth");
const { allowFirstLevel } = require("../middlewares/role");
const { actionDTypes } = require("../routes_types/request");
const { HandleError } = require("../utils/error");

router.get("/", jwt_check, allowFirstLevel, async (req, res) => {
  try {
    const css = await CssModel.find({ approved: false }).populate("user", [
      "name",
      "username",
    ]);

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
          await CssModel.findByIdAndUpdate(data.action_id, { approved: true });
          // Notification stuff
        }
      } else if (data.action_name === "remove") {
        if (data.action_type === "css") {
          await CssModel.findByIdAndDelete(data.action_id);
          // Notification stuff
        }
      } else if (data.action_name === "disapproved") {
        // Notification stuff
      }

      return res.status(200).json({ success: true });
    } catch (err) {
      return HandleError(err, res);
    }
  }
);

module.exports = router;
