const requiredRoles = ["admin", "manager", "auditor"];

const higherAuthority = (req, res, next) => {
  if (!req.user || !req.user.role) {
    return res.status(400).send({
      message: "User role is missing. Authentication required.",
    });
    
  }

  const { role } = req.user;
  if (!requiredRoles.includes(role)) {
    return res.status(403).send({
      message: "Forbidden. You do not have access to this resource. middleware",
    });
  }

  next();
};


module.exports = higherAuthority