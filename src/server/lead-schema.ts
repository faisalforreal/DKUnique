import "server-only";
import { z } from "zod";

const indianPhoneRegex = /^(?:(?:\+|0{0,2})91(\s*[-]\s*)?|[0]?)?[6789]\d{9}$/;

export const serverLeadSchema = z.object({
  type: z.enum(["quote", "callback", "rental", "demo", "contact"]),
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  phone: z.string().refine(
    (val) => {
      const cleaned = val.replace(/[\s-]/g, "");
      return indianPhoneRegex.test(cleaned) || cleaned.length >= 10;
    },
    { message: "Please provide a valid Indian phone number" }
  ),
  email: z.string().email().optional().or(z.literal("")),
  company: z.string().max(120).optional(),
  city: z.string().max(100).optional(),
  message: z.string().max(2000).optional(),
  honeypot: z.string().optional(),
  source: z.string().optional(),

  // Quote fields
  productName: z.string().optional(),
  quantity: z.number().int().positive().optional(),

  // Callback fields
  preferredTime: z.string().optional(),

  // Rental fields
  product: z.string().optional(),
  eventDate: z.string().optional(),
  duration: z.string().optional(),

  // Demo fields
  productOfInterest: z.string().optional(),
  preferredDateTime: z.string().optional(),
  mode: z.enum(["video-call", "in-person"]).optional(),
  notes: z.string().optional(),

  // Contact fields
  subject: z.string().optional(),
});

export type ValidatedLead = z.infer<typeof serverLeadSchema>;
