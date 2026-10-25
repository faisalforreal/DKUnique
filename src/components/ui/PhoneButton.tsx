import { siteConfig } from "@/config/site";
import { Button, ButtonProps } from "./Button";

interface PhoneButtonProps extends Omit<ButtonProps, "href" | "external"> {
  label?: string;
  showNumber?: boolean;
}

export function PhoneButton({
  label,
  showNumber = false,
  variant = "secondary",
  ...props
}: PhoneButtonProps) {
  const displayLabel = label || (showNumber ? siteConfig.phoneDisplay : "Call");

  return (
    <Button
      href={`tel:${siteConfig.phone}`}
      external
      variant={variant}
      {...props}
    >
      {displayLabel}
    </Button>
  );
}
