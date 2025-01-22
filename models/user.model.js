const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const userSchema = mongoose.Schema(
  {
    id: { type: String, default: uuidv4 },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone_no: { type: Number, required: true },
    company: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, default: "user" },
  },
  {
    timestapms: true,
  }
);

const UserModel = mongoose.model("user", userSchema);

module.exports = UserModel;
