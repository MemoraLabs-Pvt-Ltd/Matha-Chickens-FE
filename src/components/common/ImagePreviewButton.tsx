import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Eye, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ImagePreviewVariant = "default" | "icon";

interface ImagePreviewButtonProps {
  src: string | null | undefined;
  dialogTitle?: string;
  variant?: ImagePreviewVariant;
  className?: string;
  disabled?: boolean;
}

const springOpen = {
  type: "spring" as const,
  stiffness: 100,
  damping: 20,
};

export function ImagePreviewButton({
  src,
  dialogTitle = "Image preview",
  variant = "default",
  className,
  disabled = false,
}: ImagePreviewButtonProps) {
  const [open, setOpen] = useState(false);
  const url = src?.trim();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!url || disabled) return null;

  const overlay = (
    <AnimatePresence>
      {open && (
        <motion.div
          key="image-preview-root"
          className="fixed inset-0 z-200 flex items-center justify-center p-4"
          role="presentation"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className="absolute inset-0 bg-background/85 backdrop-blur-md"
            aria-hidden
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setOpen(false)}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={dialogTitle}
            className="relative z-10 max-h-[min(92vh,calc(100dvh-1rem))] w-full min-w-0 max-w-[min(920px,92vw)] overflow-hidden rounded-xl border-2 border-border bg-card shadow-2xl"
            initial={{ clipPath: "inset(43% 43% 43% 43%)", opacity: 0 }}
            animate={{ clipPath: "inset(0% 0% 0% 0%)", opacity: 1 }}
            exit={{
              clipPath: "inset(43% 43% 43% 43%)",
              opacity: 0,
              transition: {
                clipPath: { duration: 0.45, ...springOpen },
                opacity: { duration: 0.2, delay: 0.15 },
              },
            }}
            transition={{
              clipPath: { duration: 0.45, ...springOpen },
              opacity: { duration: 0.2 },
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              aria-label="Close preview"
              className="absolute right-2 top-2 z-10 cursor-pointer rounded-full bg-background p-2 text-foreground shadow-sm transition-colors hover:bg-muted"
              onClick={() => setOpen(false)}
            >
              <X className="size-5" />
            </button>
            <div className="box-border max-h-[min(85vh,calc(100dvh-6rem))] w-full min-w-0 overflow-auto px-3 pb-4 pt-12">
              <img
                src={url}
                alt={dialogTitle}
                className="mx-auto box-border block h-auto w-auto max-h-[min(78vh,calc(100dvh-7rem))] max-w-full min-w-0 object-contain"
                loading="eager"
                decoding="async"
                fetchPriority="high"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      {variant === "icon" ? (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          title="Preview image"
          aria-label="Preview image"
          className={cn("size-8 rounded-lg hover:bg-muted", className)}
          onClick={() => setOpen(true)}
        >
          <Eye className="size-4 text-muted-foreground" />
        </Button>
      ) : (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className={cn("h-8 border-border", className)}
          onClick={() => setOpen(true)}
        >
          <Eye className="size-4 mr-1.5" />
          Preview
        </Button>
      )}

      {createPortal(overlay, document.body)}
    </>
  );
}
