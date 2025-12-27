const ApiError = require("../utils/apiError");

module.exports = (err, req, res, next) => {
  // Zod validation errors (nếu dùng validate middleware bên dưới)
  // Postgres unique violation
  if (err?.code === "23505") {
    return res.status(409).json({ success: false, message: "Duplicate value" });
  }
  if (err?.name === "ZodError") {
    const errors = err.issues.map((i) => ({
      field: i.path.join("."),
      message: i.message,
    }));
    return res.status(400).json({
      success: false,
      message: "Validation error",
      errors,
    });
  }

  if (err instanceof ApiError) {
    const body = { success: false, message: err.message };
    if (err.errors) body.errors = err.errors;
    return res.status(err.status).json(body);
  }

  console.error(err);
  return res.status(500).json({
    success: false,
    message: "Internal server error",
  });
};
