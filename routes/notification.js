const { jwt_check } = require("../middlewares/auth");
const { allowAll } = require("../middlewares/role");
const { HandleError } = require("../utils/error");

const NotificationModel = require("../db/models/notification");
const {
  readNotificationDTypes,
  removeNotificationDTypes,
} = require("../routes_types/notification");

const router = require("express").Router();

router.get("/", jwt_check, allowAll, async (req, res) => {
  try {
    const notifications = await NotificationModel.find({ for: req.user.id });
    return res.status(200).json({ success: true, notifications });
  } catch (err) {
    return HandleError(err, res);
  }
});

router.post(
  "/read",
  jwt_check,
  allowAll,
  readNotificationDTypes,
  async (req, res) => {
    try {
      const data = req.body;
      await NotificationModel.findByIdAndUpdate(data.id, { read: data.read });
      return res.status(200).json({ success: true });
    } catch (err) {
      return HandleError(err, res);
    }
  }
);

router.post(
  "/remove",
  jwt_check,
  allowAll,
  removeNotificationDTypes,
  async (req, res) => {
    try {
      const data = req.body;
      await NotificationModel.findByIdAndDelete(data.id);
      return res.status(200).json({ success: true });
    } catch (err) {
      return HandleError(err, res);
    }
  }
);

module.exports = router;
