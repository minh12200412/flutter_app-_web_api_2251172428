const { z } = require("zod");

const updateCustomerSchema = z.object({
  body: z.object({
    full_name: z.string().min(1).optional(),
    phone_number: z.string().optional().nullable(),
    address: z.string().optional().nullable(),
    city: z.string().optional().nullable(),
    postal_code: z.string().optional().nullable(),
    is_active: z.boolean().optional(), // admin dùng
  }),
});

module.exports = { updateCustomerSchema };
