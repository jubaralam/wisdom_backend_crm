const jwt = require("jsonwebtoken");
const UserModel = require("../models/user.model");
const requiredRoles = [
  "admin",
  "manager",
  "sales_person",
  "support_agent",
  "marketing_specialist",
  "auditor",
];
const auth = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res
      .status(401)
      .send({ message: "unauthorized access, Token missing" });
  }
  try {
    const decoded = jwt.verify(token, process.env.secretKey);
    const user = await UserModel.findById({ _id: decoded.id });

    if (!user) {
      return res
        .status(401)
        .send({ message: "Unauthorized access. User not found." });
    }

    if (!requiredRoles.includes(user.role)) {
      return res.status(403).send({
        message: "Forbidden. You do not have access to this resource.",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(403).send({ message: "Invailid Token" });
  }
};

module.exports = auth;
