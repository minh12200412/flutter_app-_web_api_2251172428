module.exports = (req, res, next) => {
  const admins = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  if (admins.includes(req.user.email)) return next();

  return res.status(403).json({ success: false, message: "Forbidden" });
};
