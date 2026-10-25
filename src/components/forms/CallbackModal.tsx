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

const callbackSchema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z
    .string()
    .min(10, "Please enter a valid phone number")
    .regex(/^[0-9+\s-]{10,15}$/, "Invalid phone format"),
  preferredTime: z.string().optional(),
  message: z.string().optional(),
  honeypot: z.string().optional(),
});

type CallbackFormValues = z.infer<typeof callbackSchema>;

interface CallbackModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CallbackModal({ open, onOpenChange }: CallbackModalProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [submittedData, setSubmittedData] = useState<CallbackFormValues | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CallbackFormValues>({
    resolver: zodResolver(callbackSchema),
  });

  const onSubmit = async (data: CallbackFormValues) => {
    setStatus("loading");

    try {
      await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "callback",
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

  const handleClose = () => {
    reset();
    setStatus("idle");
    setSubmittedData(null);
    onOpenChange(false);
  };

  const whatsappMessage = submittedData
    ? `Hello DK Unique, I requested a callback. Name: ${submittedData.name}, Phone: ${submittedData.phone}, Preferred time: ${submittedData.preferredTime || "Anytime"}.`
    : "";

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{copy.forms.callback.title}</DialogTitle>
          <DialogDescription>
            Leave your contact number and our team will call you back promptly.
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

            <a
              href={`https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(
                whatsappMessage
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
            <input
              type="text"
              {...register("honeypot")}
              className="hidden"
              tabIndex={-1}
              autoComplete="off"
            />

            <Field
              label={copy.forms.callback.fields.name}
              required
              error={errors.name?.message}
            >
              <Input {...register("name")} error={!!errors.name} />
            </Field>

            <Field
              label={copy.forms.callback.fields.phone}
              required
              error={errors.phone?.message}
            >
              <Input
                type="tel"
                {...register("phone")}
                error={!!errors.phone}
              />
            </Field>

            <Field
              label={copy.forms.callback.fields.preferredTime}
              error={errors.preferredTime?.message}
            >
              <Input {...register("preferredTime")} />
            </Field>

            <Field
              label={copy.forms.callback.fields.message}
              error={errors.message?.message}
            >
              <Textarea rows={3} {...register("message")} />
            </Field>

            <Button
              type="submit"
              variant="primary"
              disabled={status === "loading"}
              className="w-full mt-2"
            >
              {status === "loading" ? copy.forms.submitting : copy.forms.submit}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
