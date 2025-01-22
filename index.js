const express = require("express");
const server = express();

const dotenv = require("dotenv").config();

const connection = require("./config/db");

const PORT = process.env.PORT || 5500;

server.use(express.json());

const auth = require("./middleware/auth");

const userRouter = require("./routes/user.route");
server.use("/api/user", userRouter);

//customer router
const customerRouter = require("./routes/customer.route");
server.use("/api/customer", auth, customerRouter);

server.listen(PORT, async () => {
  try {
    await connection;
    console.log(`server is running on PORT: ${PORT} and db has been connected`);
  } catch (error) {
    console.log(error.message);
  }
});
