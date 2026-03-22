import { cn } from "@/lib/utils";

export type AdminDialogMaxWidth = 512 | 600;

/** Responsive shell: safe width on small screens, fixed max width from `sm` up (matches previous `max-w-[512px]` / `600px`). */
export function adminDialogContentClass(
  options: {
    maxWidth?: AdminDialogMaxWidth;
    variant?: "card" | "plain";
    className?: string;
  } = {},
) {
  const { maxWidth = 512, variant = "card", className } = options;
  return cn(
    "flex max-h-[min(90vh,820px)] w-[calc(100vw-1rem)] max-w-lg flex-col gap-0 overflow-hidden p-0 sm:w-full",
    maxWidth === 600 ? "sm:max-w-[600px]" : "sm:max-w-[512px]",
    variant === "card" &&
      "rounded-xl border border-border bg-card",
    variant === "plain" && "shadow-none",
    className,
  );
}

export const adminDialogHeaderClass = cn(
  "shrink-0 border-b border-border px-4 pb-4 pt-5 pr-12 sm:px-6 sm:pb-4 sm:pt-6 sm:pr-6",
);

export const adminDialogBodyScrollClass = cn(
  "min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4 sm:px-6",
);

export const adminDialogFooterClass = cn(
  "flex shrink-0 flex-col-reverse gap-2 border-t border-border bg-muted/50 px-4 py-4 sm:flex-row sm:items-center sm:justify-end sm:px-6",
);

export const adminDialogFooterButtonClass =
  "h-9 w-full rounded-lg sm:w-auto";

/** Delete / destructive confirms: no border under the title block; spacing before the action row (or before a separate message). */
export const adminDialogDeleteHeaderClass = cn(
  "shrink-0 px-4 pb-4 pt-5 pr-12 sm:px-6 sm:pb-4 sm:pt-6 sm:pr-6",
);

/** Middle “Are you sure?” block when it’s separate from the title. */
export const adminDialogDeleteMessageClass = cn(
  "shrink-0 px-4 pb-4 pt-2 text-sm font-medium text-foreground sm:px-6",
);

export const adminDialogDeleteFooterClass = cn(
  "flex shrink-0 flex-col-reverse gap-2 border-t border-border bg-card px-4 py-3 sm:flex-row sm:items-center sm:justify-end sm:px-6",
);
