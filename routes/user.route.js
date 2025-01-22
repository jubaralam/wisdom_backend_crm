const express = require("express");
const userRouter = express.Router();

const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");
const UserModel = require("../models/user.model");

// user registeration route
userRouter.post("/register", async (req, res) => {
  const { name, email, password, phone_no, company } = req.body;
  try {
    if (!name || !email || !password || !phone_no || !company) {
      return res.status(400).send({ message: "All fields are required" });
    }
    const user = await UserModel.findOne({ email: email });
    if (user) {
      return res
        .status(409)
        .send({ message: "you are already registered, please login" });
    }

    const hashed = await bcrypt.hash(password, process.env.saltRound);

    const saveUser = UserModel({
      name,
      email,
      password: hashed,
      phone_no,
      company,
    });

    await saveUser.save();

    res.status(201).send({ message: "you have successfully registered" });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

//user login route
userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.findOne({ email: email });
    if (!user) {
      return res.status(404).send({ message: "Invalid credentials" });
    }

    const comparePassword = await bcrypt.compare(password, user.password);
    if (!comparePassword) {
      return res.status(401).send({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user._id }, process.env.secretKey, {
      expiresIn: "1h",
    });

    res.status(200).send({ message: "you have loggedIn", token: token });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = userRouter;
