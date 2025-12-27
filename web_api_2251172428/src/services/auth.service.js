const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const ApiError = require("../utils/apiError");
const customersRepo = require("../repositories/customers.repo");

async function register(payload) {
  const exists = await customersRepo.findByEmail(payload.email);
  if (exists) throw new ApiError(409, "Email already exists");

  const hashed = await bcrypt.hash(payload.password, 10);
  const [customer] = await customersRepo.create({
    ...payload,
    password: hashed,
  });
  return customer;
}

async function login({ email, password }) {
  const customer = await customersRepo.findByEmail(email);
  if (!customer) throw new ApiError(401, "Invalid email or password");

  const ok = await bcrypt.compare(password, customer.password);
  if (!ok) throw new ApiError(401, "Invalid email or password");

  const token = jwt.sign(
    { id: customer.id, email: customer.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "2h" }
  );

  const safeCustomer = {
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

  return { token, customer: safeCustomer, student_id: process.env.STUDENT_ID };
}

module.exports = { register, login };
