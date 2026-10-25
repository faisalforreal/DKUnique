export type LeadType = "quote" | "callback" | "rental" | "demo" | "contact";

export interface LeadBase {
  type: LeadType;
  name: string;
  phone: string;
  email?: string;
  city?: string;
  message?: string;
  source?: string;
  createdAt?: string;
  honeypot?: string;
}

export interface QuoteLead extends LeadBase {
  type: "quote";
  productName: string;
  company?: string;
  quantity?: number;
}

export interface CallbackLead extends LeadBase {
  type: "callback";
  preferredTime?: string;
}

export interface RentalLead extends LeadBase {
  type: "rental";
  company?: string;
  product: string;
  eventDate?: string;
  duration?: string;
  quantity?: number;
}

export interface DemoLead extends LeadBase {
  type: "demo";
  company?: string;
  productOfInterest?: string;
  preferredDateTime?: string;
  mode: "video-call" | "in-person";
  notes?: string;
}

export interface ContactLead extends LeadBase {
  type: "contact";
  company?: string;
  subject?: string;
}

export type Lead = QuoteLead | CallbackLead | RentalLead | DemoLead | ContactLead;
