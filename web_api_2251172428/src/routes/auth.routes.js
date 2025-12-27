const router = require("express").Router();
const asyncHandler = require("../middlewares/asyncHandler");
const validate = require("../middlewares/validate");
const auth = require("../middlewares/auth.middleware");
const { registerSchema, loginSchema } = require("../validators/auth.schema");
const ctrl = require("../controllers/auth.controller");

router.post("/register", validate(registerSchema), asyncHandler(ctrl.register));
router.post("/login", validate(loginSchema), asyncHandler(ctrl.login));
router.get("/me", auth, asyncHandler(ctrl.me));

module.exports = router;
