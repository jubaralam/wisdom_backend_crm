const express = require("express");
const userRouter = express.Router();

const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");
const UserModel = require("../models/user.model");

// const saltRound = process.env.saltRound;
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

    const hashed = await bcrypt.hash(password, 5);

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
      expiresIn: "24h",
    });
    console.log(user);
    res.status(200).send({ message: "you have loggedIn", token: token });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Update user route
userRouter.put("/update/:id", async (req, res) => {
  const { id } = req.params;
  const { name, email, phone_no, company, password } = req.body;

  try {
    // Hash password if provided
    let updatedFields = { name, email, phone_no, company };
    if (password) {
      const hashedPassword = await bcrypt.hash(
        password,
        parseInt(process.env.saltRound || 10)
      );
      updatedFields.password = hashedPassword;
    }

    const updatedUser = await UserModel.findByIdAndUpdate(id, updatedFields, {
      new: true,
    });
    if (!updatedUser) {
      return res.status(404).send({ message: "User not found." });
    }

    res
      .status(200)
      .send({ message: "User updated successfully.", user: updatedUser });
  } catch (error) {
    console.error("Error during user update:", error);
    res
      .status(500)
      .send({ message: "An error occurred. Please try again later." });
  }
});

// Delete user route
userRouter.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedUser = await UserModel.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).send({ message: "User not found." });
    }

    res.status(200).send({ message: "User deleted successfully." });
  } catch (error) {
    res
      .status(500)
      .send({ message: "An error occurred. Please try again later." });
  }
});
module.exports = userRouter;
