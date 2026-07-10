const admin = (req, res, next) => {
  if (req.user.roleId !== 1) {
    return res.status(403).json({
      success: false,
      message: "Access denied."
    });
  }

  next();
};

export default admin;