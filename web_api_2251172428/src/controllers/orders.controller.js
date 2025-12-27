const { ok } = require("../utils/response");
const service = require("../services/orders.service");

async function create(req, res) {
  const order = await service.createOrder(req.user, req.validated.body);
  return ok(res, "Created", order, 201);
}

async function getOne(req, res) {
  const id = Number(req.params.id);
  const data = await service.getOrderById(req.user, id);
  return ok(res, "OK", data);
}

async function listCustomerOrders(req, res) {
  const customerId = Number(req.params.id);
  const data = await service.listCustomerOrders(
    req.user,
    customerId,
    req.query
  );
  return ok(res, "OK", data);
}

async function updateStatus(req, res) {
  const id = Number(req.params.id);
  const { status } = req.validated.body;
  const updated = await service.updateOrderStatus(req.user, id, status);
  return ok(res, "Updated", updated);
}

async function pay(req, res) {
  const id = Number(req.params.id);
  const { payment_method } = req.validated.body;
  const updated = await service.payOrder(req.user, id, payment_method);
  return ok(res, "Paid", updated);
}

async function listByStatusAdmin(req, res) {
  const status = req.query.status;
  const items = await service.listOrdersByStatusAdmin(req.user, status);
  return ok(res, "OK", items);
}

module.exports = {
  create,
  getOne,
  listCustomerOrders,
  updateStatus,
  pay,
  listByStatusAdmin,
};
