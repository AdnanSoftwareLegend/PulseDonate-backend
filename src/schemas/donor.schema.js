const { z } = require("zod");

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const optionalString = z.string().trim().optional().or(z.literal(""));
const dateString = z.string().trim().optional().or(z.literal(""));
const booleanish = z.preprocess((value) => {
  if (value === "true") return true;
  if (value === "false") return false;
  return value;
}, z.boolean());

const donorFields = z.object({
  name: z.string().trim().min(2, "Full name is required").optional(),
  fullName: z.string().trim().min(2, "Full name is required").optional(),
  bloodGroup: z.enum(bloodGroups, { required_error: "Blood group is required" }),
  district: z.string().trim().min(2, "District is required"),
  phone: z.string().trim().min(5, "Phone is required"),
  email: z.string().trim().email("Email must be valid").optional().or(z.literal("")),
  age: z.coerce.number().int().min(18).max(65).optional(),
  gender: optionalString,
  lastDonationDate: dateString,
  available: booleanish.default(true),
  image: optionalString,
  imageUrl: optionalString,
  about: optionalString,
});

const donorBody = donorFields.refine((data) => data.fullName || data.name, {
  message: "Full name is required",
  path: ["name"],
});

const donorCreateSchema = z.object({
  body: donorBody,
  query: z.object({}).passthrough(),
  params: z.object({}).passthrough(),
});

const donorUpdateSchema = z.object({
  body: donorFields.partial().refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required",
  }),
  query: z.object({}).passthrough(),
  params: z.object({
    id: z.string().min(1),
  }),
});

const donorIdSchema = z.object({
  body: z.object({}).passthrough(),
  query: z.object({}).passthrough(),
  params: z.object({
    id: z.string().min(1),
  }),
});

const donorListSchema = z.object({
  body: z.object({}).passthrough(),
  params: z.object({}).passthrough(),
  query: z.object({
    search: optionalString,
    bloodGroup: optionalString,
    district: optionalString,
    available: booleanish.optional(),
  }),
});

module.exports = {
  donorCreateSchema,
  donorUpdateSchema,
  donorIdSchema,
  donorListSchema,
};
