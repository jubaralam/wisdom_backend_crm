const express = require("express");
const customerRouter = express.Router();

const CustomerModel = require("../models/customer.model");

// const saltRound = process.env.saltRound;

// customer registeration route
customerRouter.post("/register", async (req, res) => {
  const { name, email, phone_no, company } = req.body;
  const user_id = req.user._id;
  try {
    if (!name || !email || !phone_no || !company) {
      return res.status(400).send({ message: "All fields are required" });
    }
    const user = await CustomerModel.findOne({ email: email });
    if (user) {
      return res
        .status(409)
        .send({ message: "this email is already registered" });
    }

    const saveCustomer = CustomerModel({
      name,
      email,
      phone_no,
      company,
      user_id,
    });

    await saveCustomer.save();

    res.status(201).send({ message: "new customer has been registered" });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// search adn filter customers
customerRouter.get("/search", async (req, res) => {
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

//get all customers who has created by self
customerRouter.get("/:id", async (req, res) => {
  const user_id = req.user._id;
  const { id } = req.params;
  try {
    const customer = await CustomerModel.findById({ _id: id });
    if (!customer) {
      return res.status(404).send({ message: "customer not found" });
    }
    // Check if the user making the update is the owner of the customer
    if (user_id.toString() !== customer.user_id.toString()) {
      return res.status(403).send({
        message:
          "Forbidden. You do not have permission to update this customer.",
      });
    }
    res.status(200).send({ data: customer });
  } catch (error) {
    res
      .status(500)
      .send({ message: "An error occurred. Please try again later." });
  }
});
customerRouter.get("/", async (req, res) => {
  const user_id = req.user._id;
  const {page = 1, limit = 10} = req.query
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
customerRouter.put("/update/:id", async (req, res) => {
  const { id } = req.params;
  const { name, email, phone_no, company } = req.body;
  const user_id = req.user._id;
  try {
    const customer = await CustomerModel.findById({ _id: id });

    if (!customer) {
      return res.status(404).send({ message: "Customer not found." });
    }

    // Check if the user making the update is the owner of the customer
    if (user_id.toString() !== customer.user_id.toString()) {
      return res.status(403).send({
        message:
          "Forbidden. You do not have permission to update this customer.",
      });
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
customerRouter.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;
  const user_id = req.user._id;

  try {
    const customer = await CustomerModel.findById({ _id: id });

    if (!customer) {
      return res.status(404).send({ message: "Customer not found." });
    }

    // Check if the user making the update is the owner of the customer
    if (user_id.toString() !== customer.user_id.toString()) {
      return res.status(403).send({
        message:
          "Forbidden. You do not have permission to update this customer.",
      });
    }
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

module.exports = customerRouter;
