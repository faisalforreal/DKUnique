import "server-only";
import { Resend } from "resend";
import nodemailer from "nodemailer";
import type { ValidatedLead } from "./lead-schema";

export async function deliverLeadEmail(
  lead: ValidatedLead
): Promise<{ success: boolean; channel: string }> {
  const provider = process.env.LEAD_EMAIL_PROVIDER || "resend";
  const recipient = process.env.LEAD_EMAIL_TO || "developer@example.com";
  const resendApiKey = process.env.RESEND_API_KEY;

  const subject = `[New Lead - ${lead.type.toUpperCase()}] ${lead.name} (${lead.phone})`;
  const bodyText = `
New Lead Received:
------------------
Type: ${lead.type}
Name: ${lead.name}
Phone: ${lead.phone}
Email: ${lead.email || "Not provided"}
Company: ${lead.company || "Not provided"}
City: ${lead.city || "Not provided"}
Product / Service: ${lead.productName || lead.product || lead.productOfInterest || "General"}
Quantity: ${lead.quantity || 1}
Event Date: ${lead.eventDate || "N/A"}
Duration: ${lead.duration || "N/A"}
Preferred Time: ${lead.preferredTime || lead.preferredDateTime || "N/A"}
Demo Type: ${lead.mode || "N/A"}
Message: ${lead.message || lead.notes || "None"}
Source Page: ${lead.source || "Direct"}
Timestamp: ${new Date().toISOString()}
`.trim();

  // 1. Resend Delivery
  if (provider === "resend" && resendApiKey) {
    try {
      const resend = new Resend(resendApiKey);
      await resend.emails.send({
        from: "DK Unique Enquiries <onboarding@resend.dev>",
        to: recipient,
        subject: subject,
        text: bodyText,
      });
      return { success: true, channel: "resend" };
    } catch (err) {
      console.error("[Email Error] Resend dispatch failed:", err);
    }
  }

  // 2. SMTP Delivery Fallback
  const smtpHost = process.env.SMTP_HOST;
  if (smtpHost && process.env.SMTP_USER && process.env.SMTP_PASS) {
    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: parseInt(process.env.SMTP_PORT || "587", 10),
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      await transporter.sendMail({
        from: process.env.SMTP_FROM || `"DK Unique Website" <${process.env.SMTP_USER}>`,
        to: recipient,
        subject: subject,
        text: bodyText,
      });

      return { success: true, channel: "smtp" };
    } catch (err) {
      console.error("[Email Error] SMTP dispatch failed:", err);
    }
  }

  // 3. Development / Local Fallback: Log to console
  console.log("=== [DEVELOPMENT LEAD CAPTURED] ===");
  console.log(bodyText);
  console.log("===================================");
  return { success: true, channel: "console" };
}
