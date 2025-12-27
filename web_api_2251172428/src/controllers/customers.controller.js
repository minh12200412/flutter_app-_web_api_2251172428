const { ok } = require("../utils/response");
const ApiError = require("../utils/apiError");
const repo = require("../repositories/customers.repo");
const service = require("../services/customers.service");

function isAdmin(email) {
  const admins = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  return admins.includes(email);
}

async function list(req, res) {
  const customers = await repo.list();
  return ok(res, "OK", customers);
}

async function getOne(req, res) {
  const id = Number(req.params.id);
  const admin = isAdmin(req.user.email);
  if (!admin && req.user.id !== id) throw new ApiError(403, "Forbidden");
  const customer = await service.getById(id);
  return ok(res, "OK", customer);
}

async function update(req, res) {
  const id = Number(req.params.id);
  const admin = isAdmin(req.user.email);
  if (!admin && req.user.id !== id) throw new ApiError(403, "Forbidden");

  // nếu không admin thì không cho sửa is_active
  const data = { ...req.validated.body };
  if (!admin) delete data.is_active;

  const updated = await service.update(id, data);
  return ok(res, "Updated", updated);
}

module.exports = { list, getOne, update };
