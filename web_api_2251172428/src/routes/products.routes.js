const router = require("express").Router();
const asyncHandler = require("../middlewares/asyncHandler");
const auth = require("../middlewares/auth.middleware");
const admin = require("../middlewares/admin.middleware");
const validate = require("../middlewares/validate");

const ctrl = require("../controllers/products.controller");
const {
  createProductSchema,
  updateProductSchema,
} = require("../validators/products.schema");

// public
router.get("/", asyncHandler(ctrl.list));
router.get("/search", asyncHandler(ctrl.search));
router.get("/:id", asyncHandler(ctrl.getOne));

// admin
router.post(
  "/",
  auth,
  admin,
  validate(createProductSchema),
  asyncHandler(ctrl.create)
);
router.put(
  "/:id",
  auth,
  admin,
  validate(updateProductSchema),
  asyncHandler(ctrl.update)
);
router.delete("/:id", auth, admin, asyncHandler(ctrl.remove));

module.exports = router;
