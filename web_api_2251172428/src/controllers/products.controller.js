const { ok } = require("../utils/response");
const ApiError = require("../utils/apiError");
const repo = require("../repositories/products.repo");
const service = require("../services/products.service");

async function list(req, res) {
  const data = await service.listProducts(req.query);
  return ok(res, "OK", data);
}

async function search(req, res) {
  const data = await service.listProducts(req.query);
  return ok(res, "OK", data);
}

async function getOne(req, res) {
  const id = Number(req.params.id);
  const p = await service.getProductById(id);
  return ok(res, "OK", p);
}

async function create(req, res) {
  const body = req.validated.body;
  const [created] = await repo.create({
    ...body,
    stock: body.stock ?? 0,
    updated_at: new Date(),
  });
  return ok(res, "Created", created, 201);
}

async function update(req, res) {
  const id = Number(req.params.id);
  const exists = await repo.findById(id);
  if (!exists) throw new ApiError(404, "Product not found");

  const body = req.validated.body;
  const [updated] = await repo.updateById(id, {
    ...body,
    updated_at: new Date(),
  });
  return ok(res, "Updated", updated);
}

async function remove(req, res) {
  const id = Number(req.params.id);
  const exists = await repo.findById(id);
  if (!exists) throw new ApiError(404, "Product not found");

  const okToDelete = await service.canDeleteProduct(id);
  if (!okToDelete)
    throw new ApiError(
      400,
      "Cannot delete: product is used in undelivered orders"
    );

  await repo.removeById(id);
  return ok(res, "Deleted", { id });
}

module.exports = { list, search, getOne, create, update, remove };
