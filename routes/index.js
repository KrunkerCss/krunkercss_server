const router = require("express").Router();
const { HandleError } = require("../utils/error");

router.get("/", (req, res) => {
  try {
    return res.status(200).json({ message: "Hello POG :P" });
  } catch (err) {
    return HandleError(err, res);
  }
});

module.exports = router;
