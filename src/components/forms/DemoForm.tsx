"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Field, Input, Select, Textarea } from "@/components/ui/FormField";
import { Button } from "@/components/ui/Button";
import { copy } from "@/content/copy";
import { siteConfig } from "@/config/site";

const demoSchema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z
    .string()
    .min(10, "Please enter a valid phone number")
    .regex(/^[0-9+\s-]{10,15}$/, "Invalid phone format"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  company: z.string().optional(),
  productOfInterest: z.string().min(2, "Product of interest is required"),
  preferredDate: z.string().min(2, "Preferred date is required"),
  preferredTime: z.string().optional(),
  mode: z.enum(["video-call", "in-person"]),
  notes: z.string().optional(),
  honeypot: z.string().optional(),
});

type DemoFormValues = z.infer<typeof demoSchema>;

export function DemoForm({ defaultProduct }: { defaultProduct?: string }) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [submittedData, setSubmittedData] = useState<DemoFormValues | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DemoFormValues>({
    resolver: zodResolver(demoSchema),
    defaultValues: {
      productOfInterest: defaultProduct || "3D Holographic Fan",
      mode: "video-call",
    },
  });

  const onSubmit = async (data: DemoFormValues) => {
    setStatus("loading");

    try {
      await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "demo",
          ...data,
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
    return `Hello DK Unique, I booked a demo for ${submittedData.productOfInterest}. Preferred Date: ${submittedData.preferredDate}, Time: ${submittedData.preferredTime || "Flexible"}, Type: ${submittedData.mode}. Name: ${submittedData.name}, Phone: ${submittedData.phone}.`;
  };

  if (status === "success") {
    return (
      <div className="border border-line bg-paper p-6 sm:p-8 rounded-[2px] text-center space-y-6">
        <div className="p-4 bg-black/[0.03] border border-line rounded-[2px]">
          <h3 className="font-display font-bold text-xl text-ink mb-2">
            {copy.forms.success}
          </h3>
          <p className="font-mono text-xs text-muted">
            Demo: {submittedData?.productOfInterest} • Date: {submittedData?.preferredDate}
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
          Book another demo
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
          {copy.forms.demo.title}
        </h3>
        <p className="font-body text-sm text-muted mt-1">
          {copy.demo.body}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field
          label={copy.forms.demo.fields.name}
          required
          error={errors.name?.message}
        >
          <Input {...register("name")} error={!!errors.name} />
        </Field>

        <Field
          label={copy.forms.demo.fields.phone}
          required
          error={errors.phone?.message}
        >
          <Input type="tel" {...register("phone")} error={!!errors.phone} />
        </Field>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field
          label={copy.forms.demo.fields.product}
          required
          error={errors.productOfInterest?.message}
        >
          <Input
            {...register("productOfInterest")}
            error={!!errors.productOfInterest}
          />
        </Field>

        <Field
          label={copy.forms.demo.fields.mode}
          error={errors.mode?.message}
        >
          <Select {...register("mode")}>
            <option value="video-call">{copy.forms.demo.fields.modeVideo}</option>
            {siteConfig.flags.offersInPersonDemo && (
              <option value="in-person">{copy.forms.demo.fields.modeInPerson}</option>
            )}
          </Select>
        </Field>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field
          label={copy.forms.demo.fields.preferredDate}
          required
          error={errors.preferredDate?.message}
        >
          <Input
            type="date"
            {...register("preferredDate")}
            error={!!errors.preferredDate}
          />
        </Field>

        <Field
          label={copy.forms.demo.fields.preferredTime}
          error={errors.preferredTime?.message}
        >
          <Input
            type="time"
            {...register("preferredTime")}
          />
        </Field>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field
          label={copy.forms.demo.fields.company}
          error={errors.company?.message}
        >
          <Input {...register("company")} />
        </Field>

        <Field
          label={copy.forms.demo.fields.email}
          error={errors.email?.message}
        >
          <Input type="email" {...register("email")} error={!!errors.email} />
        </Field>
      </div>

      <Field
        label={copy.forms.demo.fields.notes}
        error={errors.notes?.message}
      >
        <Textarea rows={3} {...register("notes")} />
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
