const router = require("express").Router();
const asyncHandler = require("../middlewares/asyncHandler");
const auth = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validate");
const ctrl = require("../controllers/orders.controller");
const {
  createOrderSchema,
  updateStatusSchema,
  paySchema,
} = require("../validators/orders.schema");

// admin list by status: GET /api/orders?status=pending  (đề: admin)
router.get("/", auth, asyncHandler(ctrl.listByStatusAdmin));

// create order (auth)
router.post("/", auth, validate(createOrderSchema), asyncHandler(ctrl.create));

// get order by id (auth, admin hoặc owner)
router.get("/:id", auth, asyncHandler(ctrl.getOne));

// update status
router.put(
  "/:id/status",
  auth,
  validate(updateStatusSchema),
  asyncHandler(ctrl.updateStatus)
);

// pay
router.post("/:id/pay", auth, validate(paySchema), asyncHandler(ctrl.pay));

module.exports = router;
