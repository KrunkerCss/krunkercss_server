const router = require("express").Router();
const { hash, genSalt, compare } = require("bcrypt");

const { loginDTypes, registerDTypes } = require("../routes_types/auth");
const { HandleError, NOTFOUND, ERROR, EXISTS } = require("../utils/error");
const { create_access_token } = require("../utils/jwt");
const { jwt_check } = require("../middlewares/auth");

const UserModel = require("../db/models/user");

router.post("/login", loginDTypes, async (req, res) => {
  try {
    const username = req.body.username.toLowerCase().trim();
    const user = await UserModel.findOne({ username });
    if (!user) throw new NOTFOUND("user");

    if (!compare(req.body.password, user.password)) {
      throw new ERROR("Password not matched", 400, {
        type: "incPwd",
        value: true,
      });
    }

    const userPayload = {
      name: user.name,
      username: user.username,
      role: user.role,
    };

    const token = create_access_token(userPayload);

    return res.status(200).json({
      success: true,
      token,
      user: userPayload,
    });
  } catch (err) {
    return HandleError(err, res);
  }
});

router.post("/register", registerDTypes, async (req, res) => {
  try {
    const name = req.body.name.trim();
    const username = req.body.username.toLowerCase().trim();
    const password = req.body.password.trim();

    const usernameExists = await UserModel.exists({ username });
    if (usernameExists) throw new EXISTS("username");

    if (password.length < 8) {
      throw new ERROR("Password must be 8 characters or above");
    }

    const pwd = await hash(password, await genSalt(10));

    const user = new UserModel({
      name,
      username,
      password: pwd,
    });

    await user.save();

    return res
      .status(200)
      .json({ success: true, message: "Registration successful" });
  } catch (err) {
    return HandleError(err, res);
  }
});

router.get("/token", jwt_check, (req, res) => {
  return res.status(200).json({ success: true, user: req.user });
});

module.exports = router;
