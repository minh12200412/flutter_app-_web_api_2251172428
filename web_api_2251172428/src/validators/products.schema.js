const { z } = require("zod");

const CATEGORIES = ["Electronics", "Clothing", "Food", "Books", "Toys"];

const createProductSchema = z.object({
  body: z.object({
    name: z.string().min(1),
    description: z.string().optional().nullable(),
    price: z.number().positive(),
    category: z.enum(CATEGORIES),
    brand: z.string().optional().nullable(),
    stock: z.number().int().nonnegative().optional(),
    image_url: z.string().url().optional().nullable(),
    is_available: z.boolean().optional(),
  }),
});

const updateProductSchema = z.object({
  body: z.object({
    name: z.string().min(1).optional(),
    description: z.string().optional().nullable(),
    price: z.number().positive().optional(),
    category: z.enum(CATEGORIES).optional(),
    brand: z.string().optional().nullable(),
    stock: z.number().int().nonnegative().optional(),
    image_url: z.string().url().optional().nullable(),
    rating: z.number().min(0).max(5).optional(),
    review_count: z.number().int().min(0).optional(),
    is_available: z.boolean().optional(),
  }),
});

module.exports = { createProductSchema, updateProductSchema, CATEGORIES };
