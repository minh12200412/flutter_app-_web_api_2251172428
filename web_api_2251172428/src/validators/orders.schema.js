const { z } = require("zod");

const STATUSES = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];
const PAY_METHODS = ["cash", "card", "bank_transfer"];

const createOrderSchema = z.object({
  body: z.object({
    items: z
      .array(
        z.object({
          product_id: z.number().int().positive(),
          quantity: z.number().int().positive(),
        })
      )
      .min(1),
    shipping_address: z.string().min(1),
    payment_method: z.enum(PAY_METHODS).optional().nullable(),
  }),
});

const updateStatusSchema = z.object({
  body: z.object({
    status: z.enum(STATUSES),
  }),
});

const paySchema = z.object({
  body: z.object({
    payment_method: z.enum(PAY_METHODS),
  }),
});

module.exports = {
  createOrderSchema,
  updateStatusSchema,
  paySchema,
  STATUSES,
  PAY_METHODS,
};
