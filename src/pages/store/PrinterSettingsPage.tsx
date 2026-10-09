import { StoreLayout } from '@/components/common/layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePrinterSettings } from '@/hooks/usePrinterSettings';
import {
  useCreateStoreUpiId,
  useDeleteStoreUpiId,
  useStoreUpiIds,
  useUpdateStoreUpiId,
} from '@/hooks/useStoreUpiIds';
import { cn } from '@/lib/utils';
import { LABEL_SIZE_MM } from '@/lib/billing/printerSettings';
import type {
  InvoiceTextSize,
  LabelSize,
  PrinterKind,
  PrintingType,
  ReceiptPageSize,
  ReceiptTheme,
} from '@/lib/billing/printerSettings';
import { Skeleton } from '@/components/ui/skeleton';
import { Star, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const THEMES: ReceiptTheme[] = [1, 2, 3, 4];
const THEME_LABELS: Record<ReceiptTheme, string> = {
  1: 'Standard',
  2: 'Compact',
  3: 'Boxed items',
  4: 'Minimal',
};

const PAGE_SIZES: { value: Exclude<ReceiptPageSize, 'custom'>; label: string; mm: string }[] = [
  { value: '2in', label: '2 Inch', mm: '58mm' },
  { value: '3in', label: '3 Inch', mm: '68mm' },
  { value: '4in', label: '4 Inch', mm: '88mm' },
];

const LABEL_SIZES: { value: Exclude<LabelSize, 'custom'>; label: string }[] = (
  Object.entries(LABEL_SIZE_MM) as [Exclude<LabelSize, 'custom'>, { width: number; height: number }][]
).map(([value, { width, height }]) => ({
  value,
  label: `${width} x ${height} mm`,
}));

function ThemePreview({ theme }: { theme: ReceiptTheme }) {
  return (
    <div className="flex h-20 w-full flex-col gap-1 rounded-md bg-background p-2">
      <div className="mx-auto h-1.5 w-2/3 rounded-full bg-muted-foreground/40" />
      {theme !== 4 && <div className="mx-auto h-1 w-1/2 rounded-full bg-muted-foreground/25" />}
      <div className={cn('mt-1 h-px w-full', theme === 2 || theme === 4 ? 'bg-transparent' : 'bg-muted-foreground/30')} />
      <div className={cn('flex-1 space-y-1', theme === 3 && 'rounded border border-muted-foreground/30 p-1')}>
        <div className="h-1 w-full rounded-full bg-muted-foreground/25" />
        <div className="h-1 w-5/6 rounded-full bg-muted-foreground/25" />
        <div className="h-1 w-4/6 rounded-full bg-muted-foreground/25" />
      </div>
    </div>
  );
}

function StoreUpiIdsCard() {
  const { data: upiIdsResponse, isLoading } = useStoreUpiIds();
  const createUpiId = useCreateStoreUpiId();
  const updateUpiId = useUpdateStoreUpiId();
  const deleteUpiId = useDeleteStoreUpiId();

  const [label, setLabel] = useState('');
  const [upiId, setUpiId] = useState('');

  const upiIds = upiIdsResponse?.data ?? [];

  const handleAdd = () => {
    const trimmed = upiId.trim();
    if (!trimmed) {
      toast.error('Enter a UPI ID');
      return;
    }

    createUpiId.mutate(
      { label: label.trim() || undefined, upi_id: trimmed },
      {
        onSuccess: () => {
          setLabel('');
          setUpiId('');
        },
      },
    );
  };

  return (
    <Card className="border-border">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-foreground">
          UPI Payment IDs
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          Add every UPI ID the shop collects on. The default one is used for
          the receipt QR code; billers can pick a different one at print time
          if more than one is added.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading && (
          <div className="space-y-2">
            <Skeleton className="h-10 w-full rounded-lg" />
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>
        )}

        {!isLoading && upiIds.length === 0 && (
          <p className="text-sm text-muted-foreground">No UPI IDs added yet.</p>
        )}

        {!isLoading &&
          upiIds.map((u) => (
            <div
              key={u.id}
              className="flex items-center justify-between gap-3 rounded-lg border border-border bg-muted/40 px-3 py-2"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-foreground">
                  {u.upi_id}
                  {u.is_default && (
                    <span className="ml-2 rounded-full bg-store/10 px-2 py-0.5 text-[10px] font-semibold uppercase text-store">
                      Default
                    </span>
                  )}
                </p>
                {u.label && (
                  <p className="truncate text-xs text-muted-foreground">{u.label}</p>
                )}
              </div>
              <div className="flex shrink-0 items-center gap-1">
                {!u.is_default && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-8 hover:bg-muted"
                    title="Set as default"
                    disabled={updateUpiId.isPending}
                    onClick={() =>
                      updateUpiId.mutate({
                        id: u.id,
                        data: { label: u.label ?? undefined, upi_id: u.upi_id, is_default: true },
                      })
                    }
                  >
                    <Star className="size-4 text-muted-foreground" />
                  </Button>
                )}
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-8 hover:bg-muted"
                  title="Delete"
                  disabled={deleteUpiId.isPending}
                  onClick={() => deleteUpiId.mutate(u.id)}
                >
                  <Trash2 className="size-4 text-destructive" />
                </Button>
              </div>
            </div>
          ))}

        <div className="grid grid-cols-1 gap-2 border-t border-border pt-4 sm:grid-cols-[1fr_1fr_auto]">
          <Input
            placeholder="Label (optional)"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            className="h-9 bg-muted border-transparent rounded-lg text-sm"
          />
          <Input
            placeholder="UPI ID (e.g. shop@okhdfcbank)"
            value={upiId}
            onChange={(e) => setUpiId(e.target.value)}
            className="h-9 bg-muted border-transparent rounded-lg text-sm"
          />
          <Button
            type="button"
            className="h-9 bg-store hover:bg-store/90 rounded-lg text-white"
            disabled={createUpiId.isPending}
            onClick={handleAdd}
          >
            Add
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function PrinterSettingsPage() {
  const { settings, updateSettings } = usePrinterSettings();
  const [draft, setDraft] = useState(settings);

  const handleSave = () => {
    updateSettings(draft);
    toast.success('Printer settings saved on this device');
  };

  return (
    <StoreLayout title="Printer Settings">
      <div className="mx-auto max-w-3xl space-y-4">
        <Card className="border-border">
          <CardContent className="pt-6">
            <Tabs
              value={draft.defaultPrinter}
              onValueChange={(value) =>
                setDraft((prev) => ({ ...prev, defaultPrinter: value as PrinterKind }))
              }
            >
              <TabsList className="mb-2 h-10 w-full rounded-full border border-border/60 bg-[#eceef1] p-1 sm:w-auto">
                <TabsTrigger
                  value="regular"
                  className="flex-1 rounded-full px-4 h-8 text-muted-foreground data-[state=active]:bg-white data-[state=active]:text-foreground sm:flex-none"
                >
                  Regular Printer
                </TabsTrigger>
                <TabsTrigger
                  value="thermal"
                  className="flex-1 rounded-full px-4 h-8 text-muted-foreground data-[state=active]:bg-white data-[state=active]:text-foreground sm:flex-none"
                >
                  Thermal Printer
                </TabsTrigger>
              </TabsList>

              <TabsContent value="regular" className="mt-4">
                <div className="rounded-lg border border-dashed border-border bg-muted/40 p-4">
                  <p className="text-sm text-foreground">
                    Bills print through your browser&rsquo;s normal print dialog on
                    a full A4-style receipt — the same layout you see for office
                    printers. No extra configuration is needed; pick your printer
                    from the print dialog that opens after each bill.
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="thermal" className="mt-4 space-y-6">
                <div>
                  <h3 className="mb-1 text-sm font-medium text-pink-600">
                    Change Layout
                  </h3>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {THEMES.map((theme) => (
                      <button
                        key={theme}
                        type="button"
                        onClick={() => setDraft((prev) => ({ ...prev, thermal: { ...prev.thermal, theme } }))}
                        className={cn(
                          'rounded-lg border-2 p-2 text-left transition-colors',
                          draft.thermal.theme === theme
                            ? 'border-store bg-store/5'
                            : 'border-border hover:border-store/40',
                        )}
                      >
                        <ThemePreview theme={theme} />
                        <p className="mt-2 text-center text-xs font-medium text-foreground">
                          Theme {theme}
                        </p>
                        <p className="text-center text-[10px] text-muted-foreground">
                          {THEME_LABELS[theme]}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                {draft.thermal.printingType === 'full_invoice' ? (
                  <div>
                    <Label className="mb-2 block text-sm font-medium text-foreground">
                      Page Size
                    </Label>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                      {PAGE_SIZES.map((size) => (
                        <button
                          key={size.value}
                          type="button"
                          onClick={() =>
                            setDraft((prev) => ({
                              ...prev,
                              thermal: { ...prev.thermal, pageSize: size.value },
                            }))
                          }
                          className={cn(
                            'rounded-lg border px-3 py-2 text-sm font-medium transition-colors',
                            draft.thermal.pageSize === size.value
                              ? 'border-store bg-store text-white'
                              : 'border-border text-foreground hover:bg-muted',
                          )}
                        >
                          {size.label}
                          <span className="block text-[10px] opacity-75">{size.mm}</span>
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={() =>
                          setDraft((prev) => ({ ...prev, thermal: { ...prev.thermal, pageSize: 'custom' } }))
                        }
                        className={cn(
                          'rounded-lg border px-3 py-2 text-sm font-medium transition-colors',
                          draft.thermal.pageSize === 'custom'
                            ? 'border-store bg-store text-white'
                            : 'border-border text-foreground hover:bg-muted',
                        )}
                      >
                        Custom
                        <span className="block text-[10px] opacity-75">Chars</span>
                      </button>
                    </div>
                    {draft.thermal.pageSize === 'custom' && (
                      <Input
                        type="number"
                        min={20}
                        className="mt-2 h-9 w-32 bg-muted border-transparent rounded-lg text-sm"
                        value={draft.thermal.customChars}
                        onChange={(e) =>
                          setDraft((prev) => ({
                            ...prev,
                            thermal: { ...prev.thermal, customChars: Number(e.target.value) || 0 },
                          }))
                        }
                      />
                    )}
                  </div>
                ) : (
                  <div>
                    <Label className="mb-2 block text-sm font-medium text-foreground">
                      Label Size
                    </Label>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                      {LABEL_SIZES.map((size) => (
                        <button
                          key={size.value}
                          type="button"
                          onClick={() =>
                            setDraft((prev) => ({
                              ...prev,
                              thermal: { ...prev.thermal, labelSize: size.value },
                            }))
                          }
                          className={cn(
                            'rounded-lg border px-3 py-2 text-sm font-medium transition-colors',
                            draft.thermal.labelSize === size.value
                              ? 'border-store bg-store text-white'
                              : 'border-border text-foreground hover:bg-muted',
                          )}
                        >
                          {size.label}
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={() =>
                          setDraft((prev) => ({ ...prev, thermal: { ...prev.thermal, labelSize: 'custom' } }))
                        }
                        className={cn(
                          'rounded-lg border px-3 py-2 text-sm font-medium transition-colors',
                          draft.thermal.labelSize === 'custom'
                            ? 'border-store bg-store text-white'
                            : 'border-border text-foreground hover:bg-muted',
                        )}
                      >
                        Custom
                      </button>
                    </div>
                    {draft.thermal.labelSize === 'custom' && (
                      <div className="mt-2 flex items-center gap-2">
                        <Input
                          type="number"
                          min={10}
                          placeholder="Width (mm)"
                          className="h-9 w-32 bg-muted border-transparent rounded-lg text-sm"
                          value={draft.thermal.customLabelWidthMm}
                          onChange={(e) =>
                            setDraft((prev) => ({
                              ...prev,
                              thermal: { ...prev.thermal, customLabelWidthMm: Number(e.target.value) || 0 },
                            }))
                          }
                        />
                        <span className="text-sm text-muted-foreground">x</span>
                        <Input
                          type="number"
                          min={10}
                          placeholder="Height (mm)"
                          className="h-9 w-32 bg-muted border-transparent rounded-lg text-sm"
                          value={draft.thermal.customLabelHeightMm}
                          onChange={(e) =>
                            setDraft((prev) => ({
                              ...prev,
                              thermal: { ...prev.thermal, customLabelHeightMm: Number(e.target.value) || 0 },
                            }))
                          }
                        />
                        <span className="text-sm text-muted-foreground">mm</span>
                      </div>
                    )}
                  </div>
                )}

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-foreground">
                      Invoice Text Size
                    </Label>
                    <Select
                      value={draft.thermal.textSize}
                      onValueChange={(value) =>
                        setDraft((prev) => ({
                          ...prev,
                          thermal: { ...prev.thermal, textSize: value as InvoiceTextSize },
                        }))
                      }
                    >
                      <SelectTrigger className="w-full bg-muted border-transparent rounded-lg h-9 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">Small</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="large">Large</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-foreground">
                      Printing Type
                    </Label>
                    <Select
                      value={draft.thermal.printingType}
                      onValueChange={(value) =>
                        setDraft((prev) => ({
                          ...prev,
                          thermal: { ...prev.thermal, printingType: value as PrintingType },
                        }))
                      }
                    >
                      <SelectTrigger className="w-full bg-muted border-transparent rounded-lg h-9 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="full_invoice">Full Invoice</SelectItem>
                        <SelectItem value="label">Label Printing</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-3 border-t border-border pt-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="boldText" className="text-sm font-medium text-foreground">
                      Use Text Styling (Bold)
                    </Label>
                    <Switch
                      id="boldText"
                      checked={draft.thermal.boldText}
                      onCheckedChange={(checked) =>
                        setDraft((prev) => ({ ...prev, thermal: { ...prev.thermal, boldText: checked } }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="autoCut" className="text-sm font-medium text-foreground">
                        Auto Cut Paper After Printing
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Depends on your printer/driver supporting auto-cut.
                      </p>
                    </div>
                    <Switch
                      id="autoCut"
                      checked={draft.thermal.autoCutPaper}
                      onCheckedChange={(checked) =>
                        setDraft((prev) => ({ ...prev, thermal: { ...prev.thermal, autoCutPaper: checked } }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="cashDrawer" className="text-sm font-medium text-foreground">
                        Open Cash Drawer After Printing
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Depends on your printer/driver supporting a drawer kick.
                      </p>
                    </div>
                    <Switch
                      id="cashDrawer"
                      checked={draft.thermal.openCashDrawer}
                      onCheckedChange={(checked) =>
                        setDraft((prev) => ({ ...prev, thermal: { ...prev.thermal, openCashDrawer: checked } }))
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 border-t border-border pt-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-foreground">
                      Extra lines at the end
                    </Label>
                    <Input
                      type="number"
                      min={0}
                      max={10}
                      value={draft.thermal.extraLinesAtEnd}
                      onChange={(e) =>
                        setDraft((prev) => ({
                          ...prev,
                          thermal: { ...prev.thermal, extraLinesAtEnd: Number(e.target.value) || 0 },
                        }))
                      }
                      className="h-9 bg-muted border-transparent rounded-lg text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-foreground">
                      Number of copies
                    </Label>
                    <Input
                      type="number"
                      min={1}
                      max={5}
                      value={draft.thermal.numberOfCopies}
                      onChange={(e) =>
                        setDraft((prev) => ({
                          ...prev,
                          thermal: { ...prev.thermal, numberOfCopies: Number(e.target.value) || 1 },
                        }))
                      }
                      className="h-9 bg-muted border-transparent rounded-lg text-sm"
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button
            className="h-9 bg-store hover:bg-store/90 rounded-lg text-white"
            onClick={handleSave}
          >
            Save Printer Settings
          </Button>
        </div>

        <StoreUpiIdsCard />

        <Card className="border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-foreground">
              About these settings
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground space-y-1">
            <p>
              Settings are saved on this device/browser only — each till can be
              configured independently.
            </p>
            <p>
              &ldquo;{draft.defaultPrinter === 'thermal' ? 'Thermal Printer' : 'Regular Printer'}&rdquo; is
              currently used for &ldquo;Save &amp; Print Bill&rdquo; and &ldquo;Print Bill&rdquo;.
            </p>
          </CardContent>
        </Card>
      </div>
    </StoreLayout>
  );
}
