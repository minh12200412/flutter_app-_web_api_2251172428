const ApiError = require("../utils/apiError");
const repo = require("../repositories/customers.repo");

async function getById(id) {
  const c = await repo.findById(id);
  if (!c) throw new ApiError(404, "Customer not found");
  const { password, ...safe } = c;
  return safe;
}

async function update(id, data) {
  const c = await repo.findById(id);
  if (!c) throw new ApiError(404, "Customer not found");

  const [updated] = await repo.updateById(id, {
    ...data,
    updated_at: new Date(),
  });
  return updated;
}

module.exports = { getById, update };
