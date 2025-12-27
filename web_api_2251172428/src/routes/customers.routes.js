const router = require("express").Router();
const asyncHandler = require("../middlewares/asyncHandler");
const auth = require("../middlewares/auth.middleware");
const admin = require("../middlewares/admin.middleware");
const validate = require("../middlewares/validate");
const { updateCustomerSchema } = require("../validators/customers.schema");
const ctrl = require("../controllers/customers.controller");
const ordersCtrl = require("../controllers/orders.controller");

router.get("/", auth, admin, asyncHandler(ctrl.list)); // chỉ admin
router.get("/:id", auth, asyncHandler(ctrl.getOne)); // admin or self
router.put(
  "/:id",
  auth,
  validate(updateCustomerSchema),
  asyncHandler(ctrl.update)
);
router.get("/:id/orders", auth, asyncHandler(ordersCtrl.listCustomerOrders));

module.exports = router;
