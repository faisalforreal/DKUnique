import { siteConfig } from "@/config/site";
import { copy } from "@/content/copy";
import { Button, ButtonProps } from "./Button";

interface DirectionsButtonProps extends Omit<ButtonProps, "href" | "external"> {
  label?: string;
}

export function DirectionsButton({
  label = copy.findUs.getDirections,
  variant = "secondary",
  ...props
}: DirectionsButtonProps) {
  return (
    <Button
      href={siteConfig.maps.directionsUrl}
      external
      variant={variant}
      {...props}
    >
      {label}
    </Button>
  );
}
