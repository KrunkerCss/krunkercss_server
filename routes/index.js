const router = require("express").Router();
const { jwt_check } = require("../middlewares/auth");
const { allowAll } = require("../middlewares/role");
const { HandleError } = require("../utils/error");

router.use("/", require("./auth"));
router.use("/user", require("./user"));
router.use("/self", require("./self"));
router.use("/css", require("./css"));
router.use("/commission", require("./commission"));
router.use("/request", require("./request"));
router.use("/notification", require("./notification"));

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
