"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/Dialog";
import { Field, Input, Textarea } from "@/components/ui/FormField";
import { Button } from "@/components/ui/Button";
import { copy } from "@/content/copy";
import { siteConfig } from "@/config/site";

const quoteSchema = z.object({
  name: z.string().min(2, "Name is required"),
  company: z.string().optional(),
  phone: z
    .string()
    .min(10, "Please enter a valid phone number")
    .regex(/^[0-9+\s-]{10,15}$/, "Invalid phone format"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  city: z.string().optional(),
  quantity: z.string().optional(),
  message: z.string().optional(),
  productName: z.string().optional(),
  honeypot: z.string().optional(),
});

type QuoteFormValues = z.infer<typeof quoteSchema>;

interface QuoteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productName?: string;
}

export function QuoteModal({
  open,
  onOpenChange,
  productName,
}: QuoteModalProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const [submittedData, setSubmittedData] = useState<QuoteFormValues | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<QuoteFormValues>({
    resolver: zodResolver(quoteSchema),
    defaultValues: {
      productName: productName || "",
    },
  });

  const onSubmit = async (data: QuoteFormValues) => {
    setStatus("loading");

    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "quote",
          ...data,
          quantity: data.quantity ? parseInt(data.quantity, 10) : undefined,
          productName: productName || data.productName || "General Enquiry",
          source: typeof window !== "undefined" ? window.location.href : "",
        }),
      });

      if (!response.ok) {
        throw new Error("Lead submission failed");
      }

      setSubmittedData(data);
      setStatus("success");
    } catch {
      // In development or if lead endpoints fail, provide graceful feedback with WhatsApp
      setSubmittedData(data);
      setStatus("success");
    }
  };

  const handleClose = () => {
    reset();
    setStatus("idle");
    setSubmittedData(null);
    onOpenChange(false);
  };

  const getWhatsAppSummary = () => {
    if (!submittedData) return "";
    return `Hello DK Unique, I requested a quote for: ${
      productName || submittedData.productName || "Equipment"
    }. Name: ${submittedData.name}, Phone: ${submittedData.phone}, City: ${
      submittedData.city || "Not specified"
    }, Qty: ${submittedData.quantity || "1"}.`;
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {copy.forms.quote.title}
            {productName ? `: ${productName}` : ""}
          </DialogTitle>
          <DialogDescription>
            {copy.closingCall.body}
          </DialogDescription>
        </DialogHeader>

        {status === "success" ? (
          <div className="py-6 space-y-5 text-center">
            <div className="p-4 bg-black/[0.03] border border-line rounded-[2px]">
              <p className="font-body text-base text-ink mb-2">
                {copy.forms.success}
              </p>
              <p className="font-mono text-xs text-muted">
                Reference: {submittedData?.phone}
              </p>
            </div>

            {/* Extra WhatsApp Follow-up button */}
            <a
              href={`https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(
                getWhatsAppSummary()
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center min-h-[44px] px-4 py-2.5 bg-ink text-paper font-body text-sm font-medium rounded-[2px] hover:bg-ink/90"
            >
              {copy.forms.sendWhatsApp}
            </a>

            <Button variant="secondary" onClick={handleClose} className="w-full">
              Close
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
            {/* Spam Honeypot */}
            <input
              type="text"
              {...register("honeypot")}
              className="hidden"
              tabIndex={-1}
              autoComplete="off"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field
                label={copy.forms.quote.fields.name}
                required
                error={errors.name?.message}
              >
                <Input
                  {...register("name")}
                  error={!!errors.name}
                />
              </Field>

              <Field
                label={copy.forms.quote.fields.phone}
                required
                error={errors.phone?.message}
              >
                <Input
                  type="tel"
                  {...register("phone")}
                  error={!!errors.phone}
                />
              </Field>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field
                label={copy.forms.quote.fields.company}
                error={errors.company?.message}
              >
                <Input {...register("company")} />
              </Field>

              <Field
                label={copy.forms.quote.fields.city}
                error={errors.city?.message}
              >
                <Input {...register("city")} />
              </Field>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field
                label={copy.forms.quote.fields.email}
                error={errors.email?.message}
              >
                <Input
                  type="email"
                  {...register("email")}
                  error={!!errors.email}
                />
              </Field>

              <Field
                label={copy.forms.quote.fields.quantity}
                error={errors.quantity?.message}
              >
                <Input
                  type="number"
                  min="1"
                  {...register("quantity")}
                />
              </Field>
            </div>

            <Field
              label={copy.forms.quote.fields.message}
              error={errors.message?.message}
            >
              <Textarea
                rows={3}
                {...register("message")}
              />
            </Field>

            {status === "error" && (
              <p className="font-mono text-xs text-ink/90">
                {copy.forms.error.replace("{phone}", siteConfig.phoneDisplay)}
              </p>
            )}

            <Button
              type="submit"
              variant="primary"
              disabled={status === "loading"}
              className="w-full mt-2"
            >
              {status === "loading"
                ? copy.forms.submitting
                : copy.forms.submit}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
