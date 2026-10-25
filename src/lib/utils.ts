/**
 * Formats a numeric price into Indian Rupee format (e.g. 17999 -> "₹17,999").
 */
export function formatInr(amount: number | null | undefined): string {
  if (amount === null || amount === undefined) {
    return "Ask for quote";
  }
  return `₹${amount.toLocaleString("en-IN")}`;
}

/**
 * Combines conditional CSS classes cleanly without external heavy dependencies.
 */
export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}
