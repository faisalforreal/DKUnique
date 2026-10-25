import { NextRequest, NextResponse } from "next/server";
import { serverLeadSchema } from "@/server/lead-schema";
import { checkRateLimit } from "@/server/rate-limit";
import { deliverLeadEmail } from "@/server/email";
import { copy } from "@/content/copy";

export async function POST(req: NextRequest) {
  try {
    // 1. IP Rate Limiting (5 requests per minute per IP)
    const forwarded = req.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : "127.0.0.1";
    const rateLimit = checkRateLimit(ip);

    if (!rateLimit.success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again shortly." },
        { status: 429 }
      );
    }

    // 2. Parse Body & Check Honeypot
    const body = await req.json();

    if (body.honeypot && String(body.honeypot).trim() !== "") {
      // Spam honeypot triggered: return 200 silently
      return NextResponse.json({ success: true });
    }

    // 3. Schema Validation
    const parsed = serverLeadSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid form submission", details: parsed.error.format() },
        { status: 400 }
      );
    }

    // 4. Dispatch Email / Log Lead
    const delivery = await deliverLeadEmail(parsed.data);

    if (delivery.success) {
      return NextResponse.json({
        success: true,
        message: copy.forms.success,
      });
    }

    return NextResponse.json(
      { error: "Lead could not be dispatched" },
      { status: 500 }
    );
  } catch (err) {
    console.error("[API Lead Error]:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
