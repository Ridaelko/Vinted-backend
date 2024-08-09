const express = require("express");
const router = express.Router();

const uid2 = require("uid2");
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");

const User = require("../model/User");

router.post("/user/signup", async (req, res) => {
  try {
    if (!req.body.username) {
      return res.status(400).json("Username is not available");
    }
    const user = await User.findOne({ email: req.body.email });

    if (user) {
      return res.status(400).json("email already exist");
    }
    const password = req.body.password;
    const salt = uid2(64);
    const hash = SHA256(password + salt).toString(encBase64);
    const token = uid2(64);

    const newUser = new User({
      email: req.body.email,
      account: { username: req.body.username },
      newsletter: true,
      token: token,
      hash: hash,
      salt: salt,
    });
    console.log(newUser);

    await newUser.save();
    res.status(201).json({
      _id: newUser._id,
      token: token,
      account: { username: req.body.username },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

router.post("/user/login", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(400).json("Email does not exist,create an account");
    }

    const hash = SHA256(password + user.salt).toString(encBase64);

    if (hash !== user.hash) {
      return res.status(400).json("Your password is wrong");
    }

    res.json({
      _id: user.id,
      token: user.token,
      account: user.account,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
