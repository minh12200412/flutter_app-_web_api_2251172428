const router = require("express").Router();

router.use("/auth", require("./auth.routes"));
router.use("/customers", require("./customers.routes"));
router.use("/products", require("./products.routes"));
router.use("/orders", require("./orders.routes"));

module.exports = router;
