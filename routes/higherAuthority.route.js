const express = require("express");
const higherAuthorityRouter = express.Router();

const UserModel = require("../models/user.model");

higherAuthorityRouter.get("/users", async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  try {
    const query = { page, limit };
    const users = await UserModel.find()
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    if (users.length === 0) {
      return res.status(404).send({ message: "No User found" });
    }

    res.status(200).send({ data: users });
  } catch (error) {
    res
      .status(500)
      .send({ message: "An error occurred. Please try again later." });
  }
});
// Update user route
higherAuthorityRouter.put("/user/update/:id", async (req, res) => {
  const { id } = req.params;
  const { name, email, phone_no, company, password, role } = req.body;

  try {
    // Hash password if provided
    let updatedFields = {};
    if (name) updatedFields.name = name;
    if (email) updatedFields.email = email;
    if (phone_no) updatedFields.phone_no = phone_no;
    if (company) updatedFields.company = company;
    if (role) updatedFields.role = role;

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
    res
      .status(500)
      .send({ message: "An error occurred. Please try again later." });
  }
});

// Delete user route
higherAuthorityRouter.delete("/user/delete/:id", async (req, res) => {
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

module.exports = higherAuthorityRouter;
