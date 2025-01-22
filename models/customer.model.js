const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const customerSchema = mongoose.Schema(
  {
    id: { type: String, default: uuidv4 },
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      validate: {
        validator: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value), // Simple email format validation
        message: "Invalid email format.",
      },
    },
    phone_no: {
      type: Number,
      required: true,
      validate: {
        validator: (value) => value.toString().length === 10,
        message: "Phone number must be 10 digits.",
      },
    },
    company: { type: String, required: true },
    role: { type: String, default: "customer", enum: ["customer", "admin"] },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },
  },
  {
    timestamps: true, // Fixes the typo
  }
);

const CustomerModel = mongoose.model("customer", customerSchema);

module.exports = CustomerModel;
