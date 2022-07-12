const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models/user");
const router = express.Router();
// const lodash = require("lodash");
const asyncMiddleware = require("../middlewares/async");

const validation = require("../middlewares/validationMiddleware");
const {
  userSchema,
  loginSchema,
  updateSchema,
} = require("../validations/userValidation");

// create user
router.post(
  "/register",
  validation(userSchema),
  asyncMiddleware(async (req, res) => {
    let newUser = await User.findOne({ email: req.body.email });
    if (newUser)
      return res.send({
        success: false,
        msg: "User with this email already registered",
      });

    newUser = new User({
      userId: req.body.userId,
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      password: req.body.password,
    });

    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(newUser.password, salt);
    const saveUser = await newUser.save();

    // const userResponse = lodash.pick(saveUser, ['_id', 'name', 'email', 'phone', 'userId', 'isAdmin']);
    const token = newUser.generateAuthToken();

    res
      .header("x-auth-token", token)
      .send({
        success: true,
        saveUser,
        token,
        msg: "User registered successfully",
      });
  })
);

// Login
router.post(
  "/login",
  validation(loginSchema),
  asyncMiddleware(async (req, res) => {
    let user = await User.findOne({ email: req.body.email });
    if (!user)
      return res.send({
        success: false,
        message: "Invalid email or password.",
      });

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!validPassword)
      return res.send({
        success: false,
        message: "Invalid email or password.",
      });

    const { password, ...others } = user._doc;

    const token = user.generateAuthToken();
    res.header("x-auth-token", token).send({ success: true, others, token });
  })
);

// Update
router.put(
  "/:userId",
  validation(updateSchema),
  asyncMiddleware(async (req, res) => {
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(newUser.password, salt);
    }

    const updateUser = await User.findOneAndUpdate(
      { userId: req.params.userId },
      {
        $set: req.body,
      },
      { new: true }
    );

    res.send({ success: true, updateUser });
  })
);

// Delete

router.delete(
  "/:userId",
  asyncMiddleware(async (req, res) => {
    const deleteUser = await User.findOneAndDelete({
      userId: req.params.userId,
    });
    if (!deleteUser)
      return res.send({ success: false, message: "User not found" });
    res.send({ success: true, message: "User has been deleted" });
  })
);

// Get user

router.get(
  "/:userId",
  asyncMiddleware(async (req, res) => {
    const user = await User.find({ userId: req.params.userId });
    const { password, ...others } = user;
    res.send({ success: true, others });
  })
);

// Get all user

router.get(
  "/",
  asyncMiddleware(async (req, res) => {
    const userSort = req.query.sort;
    const userLimit = req.query.limit;
    let users;
    if (userSort) {
      users = await User.find().sort(userSort);
    } else if (userLimit) {
      users = await User.find().limit(userLimit);
    } else {
      users = await User.find();
    }
    res.send({ success: true, users });
  })
);

module.exports = router;
