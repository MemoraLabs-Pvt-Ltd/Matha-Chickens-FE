import { Plus, X } from "lucide-react";
import { useId, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PinCodesInputProps {
  value: string[];
  onChange: (next: string[]) => void;
  label?: string;
}

export function PinCodesInput({
  value,
  onChange,
  label = "Pin Codes",
}: PinCodesInputProps) {
  const inputId = useId();
  const [pinCode, setPinCode] = useState("");

  const normalized = useMemo(
    () => pinCode.replace(/\D/g, "").slice(0, 6),
    [pinCode],
  );

  const canAdd = normalized.length === 6 && !value.includes(normalized);

  const handleAdd = () => {
    if (!canAdd) return;
    onChange([...value, normalized]);
    setPinCode("");
  };

  const handleRemove = (code: string) => {
    onChange(value.filter((p) => p !== code));
  };

  return (
    <div className="border-t border-border pt-4 space-y-3">
      <h4 className="text-base font-medium text-foreground">{label}</h4>

      <div className="flex gap-2">
        <div className="flex-1 space-y-2">
          <Label className="sr-only" htmlFor={inputId}>
            {label}
          </Label>
          <Input
            id={inputId}
            inputMode="numeric"
            placeholder="Enter 6-digit pin code"
            value={pinCode}
            onChange={(e) => setPinCode(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && canAdd) {
                handleAdd();
              }
            }}
            className="bg-input border-transparent rounded-lg h-9 text-sm"
          />
        </div>
        <Button
          type="button"
          onClick={handleAdd}
          disabled={!canAdd}
          className="h-9 w-10 rounded-lg bg-destructive  hover:bg-destructive-foreground/90"
        >
          <Plus className="size-4 text-destructive-foreground" />
        </Button>
      </div>

      {value.length > 0 ? (
        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground">
            Added Pin Codes
          </Label>
          <div className="flex flex-wrap gap-2">
            {value.map((code) => (
              <div
                key={code}
                className="flex items-center gap-2 h-9 px-3 bg-input rounded-lg"
              >
                <span className="text-sm font-medium text-foreground">
                  {code}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemove(code)}
                  className="opacity-70 hover:opacity-100 transition-opacity"
                >
                  <X className="size-4 text-muted-foreground" />
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
