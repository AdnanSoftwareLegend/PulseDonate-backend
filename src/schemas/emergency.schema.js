const { z } = require("zod");

const emergencyCreateSchema = z.object({
  body: z.object({
    bloodGroup: z.string().trim().min(1, "Blood group is required"),
    district: z.string().trim().min(2, "District is required"),
    urgency: z.string().trim().min(2, "Urgency is required"),
    contactName: z.string().trim().min(2, "Contact name is required"),
    contactPhone: z.string().trim().min(5, "Contact phone is required"),
    details: z.string().trim().max(1000).optional().or(z.literal("")),
  }),
  query: z.object({}).passthrough(),
  params: z.object({}).passthrough(),
});

const emergencyIdSchema = z.object({
  body: z.object({}).passthrough(),
  query: z.object({}).passthrough(),
  params: z.object({
    id: z.string().min(1),
  }),
});

module.exports = { emergencyCreateSchema, emergencyIdSchema };
