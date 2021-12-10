const { jwt_check } = require("../middlewares/auth");
const { allowSecondLevel } = require("../middlewares/role");
const { HandleError } = require("../utils/error");

const CssModel = require("../db/models/css");
const CommissionModel = require("../db/models/commission");

const router = require("express").Router();

router.get("/", jwt_check, allowSecondLevel, async (req, res) => {
  try {
    const csses = await CssModel.find({ user: req.user.id });
    const commissions = await CommissionModel.find({ user: req.user.id });

    return res
      .status(200)
      .json({ success: true, payload: { csses, commissions } });
  } catch (err) {
    return HandleError(err, res);
  }
});

module.exports = router;
