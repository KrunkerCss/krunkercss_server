const router = require("express").Router();
const { jwt_check } = require("../middlewares/auth");
const { allowAll } = require("../middlewares/role");
const { HandleError } = require("../utils/error");

const authRoutes = require("./auth");

router.use("/", authRoutes);

router.get("/", (req, res) => {
  try {
    return res.status(200).json({ message: "Hello POG :P" });
  } catch (err) {
    return HandleError(err, res);
  }
});

// Dummy route
router.get("/dummy", jwt_check, allowAll, (req, res) => {
  return res.status(200).json({ success: true, message: "Dummy Route" });
});

module.exports = router;
