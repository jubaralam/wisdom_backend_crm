const express = require("express");
const server = express();

const dotenv = require("dotenv").config();

const connection = require("./config/db");

const PORT = process.env.PORT || 5500;

server.use(express.json());

//cors Enables to allow seamless integration between backend and frontend, its required for the frontend
const cors = require("cors");
server.use(cors());
const auth = require("./middleware/auth");

const userRouter = require("./routes/user.route");
server.use("/api/user", userRouter);

//customer router
const customerRouter = require("./routes/customer.route");
server.use("/api/customer", auth, customerRouter);

//higher Authority Router (for admin, manager, auditor)
const higherAuthority = require("./middleware/higherAuthority");
const higherAuthorityRouter = require("./routes/higherAuthority.route");
server.use(
  "/api/higher-authority",
  [auth, higherAuthority],
  higherAuthorityRouter
);

// for all statistics
const statisticsRouter = require("./routes/statistics.route");
server.use(
  "/api/higher-authority/statistics",
  [auth, higherAuthority],
  statisticsRouter
);

const homeRoute = require("./homeRoute");

server.use("/", homeRoute);

server.listen(PORT, async () => {
  try {
    await connection;
    console.log(`server is running on PORT: ${PORT} and db has been connected`);
  } catch (error) {
    console.log(error.message);
  }
});
