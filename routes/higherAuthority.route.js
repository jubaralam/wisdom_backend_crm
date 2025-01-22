const express = require("express");
const higherAuthorityRouter = express.Router();

const UserModel = require("../models/user.model");
const CustomerModel = require("../models/customer.model");

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

// search adn filter customers
higherAuthorityRouter.get("/customer/search", async (req, res) => {
  const { name, email, phone, company, page = 1, limit = 10 } = req.query;

  try {
    const query = {};
    if (name) query.name = { $regex: name, $options: "i" }; // case-insensitive search
    if (email) query.email = { $regex: email, $options: "i" }; // case-insensitive search
    if (phone) query.phone = { $regex: phone, $options: "i" }; // case-insensitive search
    if (company) query.company = { $regex: company, $options: "i" }; // case-insensitive search

    const customers = await CustomerModel.find(query)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    if (customers.length === 0) {
      return res.status(404).send({ message: "No customers found" });
    }

    res.status(200).send({ data: customers });
  } catch (error) {
    res
      .status(500)
      .send({ message: "An error occurred.", error: error.message });
  }
});

//get all customers
higherAuthorityRouter.get("/customer/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const customer = await CustomerModel.findById({ _id: id });
    if (!customer) {
      return res.status(404).send({ message: "customer not found" });
    }
    // Check if the user making the update is the owner of the customer

    res.status(200).send({ data: customer });
  } catch (error) {
    res
      .status(500)
      .send({ message: "An error occurred. Please try again later." });
  }
});
higherAuthorityRouter.get("/customers", async (req, res) => {
  const user_id = req.user._id;
  const { page = 1, limit = 10 } = req.query;
  try {
    const customers = await CustomerModel.find({ user_id })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    if (customers.length === 0) {
      return res.status(404).send({ message: "No customers found" });
    }

    res.status(200).send({ data: customers });
  } catch (error) {
    res
      .status(500)
      .send({ message: "An error occurred. Please try again later ." });
  }
});

// Update customer route
higherAuthorityRouter.put("/customer/update/:id", async (req, res) => {
  const { id } = req.params;
  const { name, email, phone_no, company } = req.body;

  try {
    const customer = await CustomerModel.findById({ _id: id });

    if (!customer) {
      return res.status(404).send({ message: "Customer not found." });
    }

    let updatedFields = {};
    if (name) updatedFields.name = name;
    if (email) updatedFields.email = email;
    if (phone_no) updatedFields.phone_no = phone_no;
    if (company) updatedFields.company = company;

    const updated = await CustomerModel.findByIdAndUpdate(id, updatedFields, {
      new: true,
    });
    if (!updated) {
      return res.status(404).send({ message: "customer not found." });
    }

    res.status(200).send({
      message: "customer data has been updated successfully.",
      customer: updated,
    });
  } catch (error) {
    res
      .status(500)
      .send({ message: "An error occurred. Please try again later." });
  }
});

// Delete user route
higherAuthorityRouter.delete("/customer/delete/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedCustomer = await CustomerModel.findByIdAndDelete(id);
    if (!deletedCustomer) {
      return res.status(404).send({ message: "customer not found." });
    }

    res
      .status(200)
      .send({ message: "customer has been deleted successfully." });
  } catch (error) {
    res
      .status(500)
      .send({ message: "An error occurred. Please try again later." });
  }
});

module.exports = higherAuthorityRouter;
