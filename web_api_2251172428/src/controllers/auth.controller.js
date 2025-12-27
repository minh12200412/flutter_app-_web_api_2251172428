const { ok } = require("../utils/response");
const customersRepo = require("../repositories/customers.repo");
const authService = require("../services/auth.service");

async function register(req, res) {
  const body = req.validated.body;
  const customer = await authService.register(body);
  return ok(res, "Register successful", customer, 201);
}

async function login(req, res) {
  const body = req.validated.body;
  const data = await authService.login(body);
  return ok(res, "Login successful", data, 200);
}

async function me(req, res) {
  const customer = await customersRepo.findById(req.user.id);
  const safe = {
    id: customer.id,
    email: customer.email,
    full_name: customer.full_name,
    phone_number: customer.phone_number,
    address: customer.address,
    city: customer.city,
    postal_code: customer.postal_code,
    is_active: customer.is_active,
    created_at: customer.created_at,
    updated_at: customer.updated_at,
  };
  return ok(res, "OK", safe);
}

module.exports = { register, login, me };
