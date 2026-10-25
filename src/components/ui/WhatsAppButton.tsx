import { siteConfig } from "@/config/site";
import { Button, ButtonProps } from "./Button";

interface WhatsAppButtonProps extends Omit<ButtonProps, "href" | "external"> {
  label?: string;
  message?: string;
}

export function WhatsAppButton({
  label = "WhatsApp",
  message = "Hello, I am enquiring about products from DK Unique Production.",
  variant = "secondary",
  ...props
}: WhatsAppButtonProps) {
  const url = `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(
    message
  )}`;

  return (
    <Button href={url} external variant={variant} {...props}>
      {label}
    </Button>
  );
}
