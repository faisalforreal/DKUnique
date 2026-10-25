"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Field, Input, Textarea } from "@/components/ui/FormField";
import { Button } from "@/components/ui/Button";
import { copy } from "@/content/copy";
import { siteConfig } from "@/config/site";

const rentalSchema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z
    .string()
    .min(10, "Please enter a valid phone number")
    .regex(/^[0-9+\s-]{10,15}$/, "Invalid phone format"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  company: z.string().optional(),
  product: z.string().min(2, "Equipment needed is required"),
  eventDate: z.string().min(2, "Event date is required"),
  city: z.string().min(2, "City is required"),
  duration: z.string().optional(),
  quantity: z.string().optional(),
  message: z.string().optional(),
  honeypot: z.string().optional(),
});

type RentalFormValues = z.infer<typeof rentalSchema>;

export function RentalForm({ defaultProduct }: { defaultProduct?: string }) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [submittedData, setSubmittedData] = useState<RentalFormValues | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RentalFormValues>({
    resolver: zodResolver(rentalSchema),
    defaultValues: {
      product: defaultProduct || "3D Hologram Fan Rental",
    },
  });

  const onSubmit = async (data: RentalFormValues) => {
    setStatus("loading");

    try {
      await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "rental",
          ...data,
          quantity: data.quantity ? parseInt(data.quantity, 10) : 1,
          source: typeof window !== "undefined" ? window.location.href : "",
        }),
      });

      setSubmittedData(data);
      setStatus("success");
    } catch {
      setSubmittedData(data);
      setStatus("success");
    }
  };

  const getWhatsAppMessage = () => {
    if (!submittedData) return "";
    return `Hello DK Unique, I submitted a rental request for ${submittedData.product}. Date: ${submittedData.eventDate}, City: ${submittedData.city}, Duration: ${submittedData.duration || "1 day"}, Qty: ${submittedData.quantity || "1"}. Name: ${submittedData.name}, Phone: ${submittedData.phone}.`;
  };

  if (status === "success") {
    return (
      <div className="border border-line bg-paper p-6 sm:p-8 rounded-[2px] text-center space-y-6">
        <div className="p-4 bg-black/[0.03] border border-line rounded-[2px]">
          <h3 className="font-display font-bold text-xl text-ink mb-2">
            {copy.forms.success}
          </h3>
          <p className="font-mono text-xs text-muted">
            Equipment: {submittedData?.product} • Date: {submittedData?.eventDate}
          </p>
        </div>

        <a
          href={`https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(
            getWhatsAppMessage()
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex w-full items-center justify-center min-h-[48px] px-6 py-3 bg-ink text-paper font-body text-sm font-medium rounded-[2px] hover:bg-ink/90"
        >
          {copy.forms.sendWhatsApp}
        </a>

        <Button
          variant="secondary"
          onClick={() => {
            reset();
            setStatus("idle");
            setSubmittedData(null);
          }}
          className="w-full"
        >
          Submit another inquiry
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="border border-line bg-paper p-6 sm:p-8 rounded-[2px] space-y-5"
    >
      <input
        type="text"
        {...register("honeypot")}
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
      />

      <div className="border-b border-line pb-3">
        <h3 className="font-display font-bold text-xl text-ink">
          {copy.forms.rental.title}
        </h3>
        <p className="font-body text-sm text-muted mt-1">
          {copy.rental.body}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field
          label={copy.forms.rental.fields.name}
          required
          error={errors.name?.message}
        >
          <Input {...register("name")} error={!!errors.name} />
        </Field>

        <Field
          label={copy.forms.rental.fields.phone}
          required
          error={errors.phone?.message}
        >
          <Input type="tel" {...register("phone")} error={!!errors.phone} />
        </Field>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field
          label={copy.forms.rental.fields.product}
          required
          error={errors.product?.message}
        >
          <Input {...register("product")} error={!!errors.product} />
        </Field>

        <Field
          label={copy.forms.rental.fields.eventDate}
          required
          error={errors.eventDate?.message}
        >
          <Input
            type="date"
            {...register("eventDate")}
            error={!!errors.eventDate}
          />
        </Field>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Field
          label={copy.forms.rental.fields.city}
          required
          error={errors.city?.message}
        >
          <Input {...register("city")} error={!!errors.city} />
        </Field>

        <Field
          label={copy.forms.rental.fields.duration}
          error={errors.duration?.message}
        >
          <Input {...register("duration")} />
        </Field>

        <Field
          label={copy.forms.rental.fields.quantity}
          error={errors.quantity?.message}
        >
          <Input type="number" min="1" {...register("quantity")} />
        </Field>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field
          label={copy.forms.rental.fields.company}
          error={errors.company?.message}
        >
          <Input {...register("company")} />
        </Field>

        <Field
          label={copy.forms.rental.fields.email}
          error={errors.email?.message}
        >
          <Input type="email" {...register("email")} error={!!errors.email} />
        </Field>
      </div>

      <Field
        label={copy.forms.rental.fields.message}
        error={errors.message?.message}
      >
        <Textarea rows={3} {...register("message")} />
      </Field>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        disabled={status === "loading"}
        className="w-full mt-2"
      >
        {status === "loading" ? copy.forms.submitting : copy.forms.submit}
      </Button>
    </form>
  );
}
