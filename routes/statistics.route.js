const express = require("express");
const statisticsRouter = express.Router();

const moment = require("moment");

const UserModel = require("../models/user.model");
const CustomerModel = require("../models/customer.model");

statisticsRouter.get("/customers", async (req, res) => {
  try {
    const totalCustomers = await CustomerModel.countDocuments();

    const startOfMonth = moment().startOf("month").toDate();
    const newCustomers = await CustomerModel.countDocuments({
      createdAt: { $gte: startOfMonth },
    });

    const startOfLast30Days = moment().subtract(30, "days").toDate();
    const activeCustomers = await CustomerModel.countDocuments({
      updatedAt: { $gte: startOfLast30Days },
    });

    const data = { totalCustomers, newCustomers, activeCustomers };

    res.status(200).send({ data });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

statisticsRouter.get("/users", async (req, res) => {
  try {
    const userRoles = await UserModel.aggregate([
      {
        $group: {
          _id: "$role",
          role_count: { $sum: 1 },
        },
      },
    ]);

    res.status(200).send({ data: userRoles });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

const getData = async () => {};

// getData();

module.exports = statisticsRouter;
