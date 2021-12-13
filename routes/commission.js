const router = require("express").Router();
const { HandleError, EXISTS, NOTFOUND, BAD } = require("../utils/error");
const CommissionModel = require("../db/models/commission");
const UserModel = require("../db/models/user");
const { jwt_check } = require("../middlewares/auth");
const { allowSecondLevel } = require("../middlewares/role");
const {
  postCommissionDTypes,
  putCommissionDTypes,
  deleteCommissionDTypes,
} = require("../routes_types/commission");
const { admin, mod, css_maker } = require("../utils/role");

router.get("/", async (req, res) => {
  try {
    const commissions = await CommissionModel.find({});
    return res.status(200).json({ success: true, payload: commissions });
  } catch (err) {
    return HandleError(err, res);
  }
});

router.post(
  "/",
  jwt_check,
  allowSecondLevel,
  postCommissionDTypes,
  async (req, res) => {
    try {
      const user = await UserModel.findOne({
        username: req.user.username,
        role: req.user.role,
      });
      if (!user) throw new NOTFOUND("User");

      const need_approval = user.role === css_maker[0];

      const exists = await CommissionModel.exists({
        title: req.body.title,
      });
      if (exists) throw new EXISTS(req.body.title);

      const Commission = new CommissionModel({
        user: user,
        approved: !need_approval,
        ...req.body,
      });
      await Commission.save();

      return res.status(200).json({
        success: true,
        message: `Commission Uploaded.${
          need_approval ? " Waiting for approval." : ""
        }`,
      });
    } catch (err) {
      return HandleError(err, res);
    }
  }
);

router.put(
  "/",
  jwt_check,
  allowSecondLevel,
  putCommissionDTypes,
  async (req, res) => {
    try {
      const user = await UserModel.findOne({
        username: req.user.username,
        role: req.user.role,
      });
      if (!user) throw new NOTFOUND("User");

      const need_approval = user.role === css_maker[0];

      if (req.body.prev_title !== req.body.title) {
        const exists = await CommissionModel.findOne({
          title: req.body.title,
        });

        if (exists) throw new EXISTS("Another Commission with same title");
      }

      const commission = await CommissionModel.findOneAndUpdate(
        { user: user, title: req.body.prev_title },
        {
          approved: !need_approval,
          title: req.body.title,
          description: req.body.description,
          screenshots: req.body.screenshots,
          pricing: req.body.pricing,
        }
      );

      if (!commission) throw new NOTFOUND("Commission");

      return res.status(200).json({
        success: true,
        message: `Commission Updated.${
          need_approval ? " Waiting for approval." : ""
        }`,
      });
    } catch (err) {
      return HandleError(err, res);
    }
  }
);

router.delete(
  "/",
  jwt_check,
  allowSecondLevel,
  deleteCommissionDTypes,
  async (req, res) => {
    try {
      const data = req.body;
      const user = await UserModel.findOne({
        username: req.user.username,
        role: req.user.role,
      });
      if (!user) throw new NOTFOUND("User");

      const commission = await CommissionModel.findOne({
        title: data.title,
      }).populate("user", ["username", "role"]);
      if (!commission) throw new NOTFOUND("Commission");

      const commissionOwner = req.user.username === commission.user.username;
      const isAdmin = req.user.role === admin[0];
      const isMod = req.user.role === mod[0];
      const isAdminCommission = commission.user.role === admin[0];
      const isModCommission = commission.user.role === mod[0];

      let pass = false;
      if (
        commissionOwner ||
        (isAdmin && !isAdminCommission) ||
        (isMod && !isModCommission && !isAdminCommission)
      ) {
        pass = true;
      }
      if (!pass) throw new BAD("Request");

      await commission.remove();

      return res.status(200).json({
        success: true,
        message: "Commission deleted",
      });
    } catch (err) {
      return HandleError(err, res);
    }
  }
);

module.exports = router;
