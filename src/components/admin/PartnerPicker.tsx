import { useMemo, useState } from "react";
import { Check, ChevronDown, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface PartnerPickerProps {
  partners: { id: number; name: string }[];
  value: string;
  onChange: (value: string) => void;
}

export function PartnerPicker({ partners, value, onChange }: PartnerPickerProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const selected = partners.find((p) => String(p.id) === value);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? partners.filter((p) => p.name.toLowerCase().includes(q)) : partners;
  }, [partners, query]);

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) setQuery("");
      }}
    >
      <PopoverTrigger asChild>
        <button
          type="button"
          className="flex h-9 w-full items-center justify-between gap-2 rounded-lg bg-muted px-2.5 text-sm"
        >
          <span className={cn("truncate", !selected && "text-muted-foreground")}>
            {selected?.name ?? "Select a partner"}
          </span>
          <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-(--radix-popover-trigger-width) min-w-64 p-2"
      >
        <div className="relative mb-2">
          <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search partners..."
            className="h-9 bg-muted border-transparent rounded-lg pl-8 text-sm"
          />
        </div>
        <div className="max-h-64 overflow-y-auto">
          {filtered.length === 0 ? (
            <p className="px-2 py-3 text-center text-sm text-muted-foreground">
              No partners found
            </p>
          ) : (
            filtered.map((partner) => {
              const isSelected = String(partner.id) === value;
              return (
                <button
                  key={partner.id}
                  type="button"
                  onClick={() => {
                    onChange(String(partner.id));
                    setOpen(false);
                  }}
                  className="flex w-full items-center justify-between gap-2 rounded-md px-2 py-1.5 text-left text-sm hover:bg-accent"
                >
                  <span className="truncate">{partner.name}</span>
                  {isSelected && <Check className="size-4 shrink-0" />}
                </button>
              );
            })
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
