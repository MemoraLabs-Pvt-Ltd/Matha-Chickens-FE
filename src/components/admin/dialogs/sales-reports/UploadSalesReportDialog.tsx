import { useRef, useState } from "react";
import { AlertTriangle, CheckCircle2, FileSpreadsheet, Loader2, Upload, XCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  adminDialogBodyScrollClass,
  adminDialogContentClass,
  adminDialogFooterButtonClass,
  adminDialogFooterClass,
  adminDialogHeaderClass,
} from "@/lib/adminDialogContent";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useStores } from "@/hooks/useStores";
import {
  useCancelSalesReportImport,
  useConfirmSalesReportImport,
  useSalesReportImport,
  useSalesReportImportErrors,
  useUploadSalesReport,
} from "@/hooks/useSalesReports";
import type { SalesReportUploadResult } from "@/lib/api/salesReports";
import { formatInr } from "@/lib/display/formatting";

const ACCEPTED_EXTENSION = ".xlsx";
const MAX_FILE_SIZE_BYTES = 15 * 1024 * 1024;

interface UploadSalesReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UploadSalesReportDialog({ open, onOpenChange }: UploadSalesReportDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <UploadSalesReportDialogBody
        key={open ? "open" : "closed"}
        onOpenChange={onOpenChange}
      />
    </Dialog>
  );
}

function UploadSalesReportDialogBody({
  onOpenChange,
}: {
  onOpenChange: (open: boolean) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedStoreId, setSelectedStoreId] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadResult, setUploadResult] = useState<SalesReportUploadResult | null>(null);
  const [showErrors, setShowErrors] = useState(false);

  const { data: storesData, isLoading: storesLoading } = useStores({ limit: 100 });
  const stores = storesData?.data ?? [];

  const uploadMutation = useUploadSalesReport();
  const confirmMutation = useConfirmSalesReportImport();
  const cancelMutation = useCancelSalesReportImport();

  const importId = uploadResult?.id ?? null;
  const { data: polledData } = useSalesReportImport(importId);
  const current = polledData?.data ?? uploadResult ?? null;

  const isConfirmed = confirmMutation.isSuccess || (current && current.status !== "pending_confirmation");
  const isInFlight = current?.status === "validating" || current?.status === "processing";
  const isSettled =
    current &&
    ["completed", "completed_with_errors", "failed"].includes(current.status);

  const { data: errorsData } = useSalesReportImportErrors(showErrors ? importId : null);

  const handleFileChange = (file: File | null) => {
    if (!file) {
      setSelectedFile(null);
      return;
    }
    if (!file.name.toLowerCase().endsWith(ACCEPTED_EXTENSION)) {
      toast.error("Only .xlsx files are supported");
      return;
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      toast.error("File is too large (max 15 MB)");
      return;
    }
    setSelectedFile(file);
  };

  const handleUpload = () => {
    if (!selectedFile || !selectedStoreId) return;

    uploadMutation.mutate(
      { file: selectedFile, storeId: Number(selectedStoreId) },
      {
        onSuccess: (response) => setUploadResult(response.data),
      },
    );
  };

  const handleConfirm = () => {
    if (!importId) return;
    confirmMutation.mutate(importId);
  };

  const handleDiscard = () => {
    if (importId) {
      cancelMutation.mutate(importId, { onSettled: () => onOpenChange(false) });
      return;
    }
    onOpenChange(false);
  };

  const handleClose = () => onOpenChange(false);

  // Step 1: pick store + file, nothing uploaded yet
  if (!uploadResult) {
    const canUpload = Boolean(selectedFile) && Boolean(selectedStoreId) && !uploadMutation.isPending;

    return (
      <DialogContent className={adminDialogContentClass({ maxWidth: 600 })}>
        <DialogHeader className={cn(adminDialogHeaderClass, "space-y-1.5")}>
          <DialogTitle className="text-lg font-semibold text-foreground">
            Upload Sales Report
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Import a Vyapar Sale Report (.xlsx) for a store
          </DialogDescription>
        </DialogHeader>

        <div className={cn(adminDialogBodyScrollClass, "space-y-4")}>
          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground">Store *</Label>
            <Select value={selectedStoreId} onValueChange={setSelectedStoreId}>
              <SelectTrigger className="w-full h-9 bg-input border-transparent rounded-lg text-sm">
                <SelectValue
                  placeholder={storesLoading ? "Loading stores..." : "Select a store"}
                />
              </SelectTrigger>
              <SelectContent>
                {stores.map((store) => (
                  <SelectItem key={store.id} value={String(store.id)}>
                    {store.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground">Excel File *</Label>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border bg-input px-4 py-8 text-center transition-colors hover:border-admin/50"
            >
              <FileSpreadsheet className="size-8 text-muted-foreground" />
              {selectedFile ? (
                <div>
                  <p className="text-sm font-medium text-foreground">{selectedFile.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(selectedFile.size / 1024).toFixed(0)} KB
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Click to select a .xlsx file
                  </p>
                  <p className="text-xs text-muted-foreground">Max 15 MB</p>
                </div>
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept={ACCEPTED_EXTENSION}
              className="hidden"
              onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
            />
          </div>

          {uploadMutation.isError && (
            <div className="flex items-start gap-2 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
              <XCircle className="size-4 shrink-0 mt-0.5" />
              <span>
                {uploadMutation.error instanceof Error
                  ? uploadMutation.error.message
                  : "Failed to upload and validate the file"}
              </span>
            </div>
          )}
        </div>

        <div className={adminDialogFooterClass}>
          <Button
            variant="outline"
            onClick={handleClose}
            className={cn(adminDialogFooterButtonClass, "border border-border px-4 text-foreground")}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            disabled={!canUpload}
            className={cn(adminDialogFooterButtonClass, "bg-admin px-4 text-white hover:bg-admin/90")}
          >
            {uploadMutation.isPending ? (
              <>
                <Loader2 className="size-4 mr-2 animate-spin" />
                Validating...
              </>
            ) : (
              <>
                <Upload className="size-4 mr-2" />
                Upload & Preview
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    );
  }

  // Step 2: preview returned, waiting for confirm — show it until the user confirms
  if (current && current.status === "pending_confirmation" && !isConfirmed) {
    const preview = uploadResult.preview;

    return (
      <DialogContent className={adminDialogContentClass({ maxWidth: 600 })}>
        <DialogHeader className={cn(adminDialogHeaderClass, "space-y-1.5")}>
          <DialogTitle className="text-lg font-semibold text-foreground">
            Review Before Import
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {uploadResult.file_name}
          </DialogDescription>
        </DialogHeader>

        <div className={cn(adminDialogBodyScrollClass, "space-y-4")}>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <SummaryTile label="Invoices" value={String(preview.total_invoices)} />
            <SummaryTile label="Total Amount" value={formatInr(preview.total_amount)} />
            <SummaryTile
              label="Date Range"
              value={
                preview.date_range
                  ? `${preview.date_range.from} – ${preview.date_range.to}`
                  : "-"
              }
            />
          </div>

          {preview.warnings.length > 0 && (
            <div className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">
              <div className="flex items-center gap-2 font-medium">
                <AlertTriangle className="size-4" />
                {preview.warnings.length} warning{preview.warnings.length === 1 ? "" : "s"}
              </div>
              <ul className="mt-1 list-disc pl-5 space-y-0.5">
                {preview.warnings.slice(0, 5).map((warning, index) => (
                  <li key={index}>{warning}</li>
                ))}
              </ul>
            </div>
          )}

          {preview.errors.length > 0 && (
            <div className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
              <div className="flex items-center gap-2 font-medium">
                <XCircle className="size-4" />
                {preview.errors.length} row{preview.errors.length === 1 ? "" : "s"} will be skipped
              </div>
              <ul className="mt-1 list-disc pl-5 space-y-0.5">
                {preview.errors.slice(0, 5).map((err, index) => (
                  <li key={index}>{err}</li>
                ))}
              </ul>
            </div>
          )}

          {preview.sample_rows.length > 0 && (
            <div className="rounded-lg border border-border overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left px-3 py-2 font-medium text-foreground">Invoice</th>
                    <th className="text-left px-3 py-2 font-medium text-foreground">Partner</th>
                    <th className="text-left px-3 py-2 font-medium text-foreground">Date</th>
                    <th className="text-right px-3 py-2 font-medium text-foreground">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {preview.sample_rows.map((row) => (
                    <tr key={row.sheet_row} className="border-t border-border">
                      <td className="px-3 py-2 text-foreground">{row.invoice_no}</td>
                      <td className="px-3 py-2 text-foreground">{row.partner_name}</td>
                      <td className="px-3 py-2 text-foreground">{row.date}</td>
                      <td className="px-3 py-2 text-right text-foreground">
                        {formatInr(row.total_amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className={adminDialogFooterClass}>
          <Button
            variant="outline"
            onClick={handleDiscard}
            disabled={cancelMutation.isPending}
            className={cn(adminDialogFooterButtonClass, "border border-border px-4 text-foreground")}
          >
            Discard
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={confirmMutation.isPending || preview.total_invoices === 0}
            className={cn(adminDialogFooterButtonClass, "bg-admin px-4 text-white hover:bg-admin/90")}
          >
            {confirmMutation.isPending ? "Starting Import..." : "Confirm Import"}
          </Button>
        </div>
      </DialogContent>
    );
  }

  // Step 3: processing / settled
  return (
    <DialogContent className={adminDialogContentClass({ maxWidth: 600 })}>
      <DialogHeader className={cn(adminDialogHeaderClass, "space-y-1.5")}>
        <DialogTitle className="text-lg font-semibold text-foreground">
          {isInFlight ? "Importing..." : "Import Complete"}
        </DialogTitle>
        <DialogDescription className="text-sm text-muted-foreground">
          {uploadResult.file_name}
        </DialogDescription>
      </DialogHeader>

      <div className={cn(adminDialogBodyScrollClass, "space-y-4")}>
        {isInFlight && (
          <div className="flex items-center gap-3 rounded-lg bg-muted/50 px-4 py-6 justify-center text-sm text-muted-foreground">
            <Loader2 className="size-5 animate-spin" />
            Processing invoices, this page will update automatically...
          </div>
        )}

        {isSettled && current && (
          <>
            <div className="flex items-center gap-2">
              {current.status === "completed" ? (
                <CheckCircle2 className="size-5 text-emerald-600" />
              ) : current.status === "completed_with_errors" ? (
                <AlertTriangle className="size-5 text-amber-600" />
              ) : (
                <XCircle className="size-5 text-destructive" />
              )}
              <span className="text-sm font-medium text-foreground">
                {current.status === "completed" && "All invoices imported successfully"}
                {current.status === "completed_with_errors" && "Import finished with some issues"}
                {current.status === "failed" && "Import failed"}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <SummaryTile label="Inserted" value={String(current.inserted_rows)} />
              <SummaryTile label="Skipped (duplicate)" value={String(current.skipped_duplicate_rows)} />
              <SummaryTile label="Failed" value={String(current.failed_rows)} />
            </div>

            {current.failed_rows > 0 && (
              <div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowErrors((v) => !v)}
                  className="h-8 rounded-lg text-xs"
                >
                  {showErrors ? "Hide" : "View"} failed rows
                </Button>
                {showErrors && (
                  <div className="mt-2 rounded-lg border border-border overflow-hidden max-h-48 overflow-y-auto">
                    <table className="w-full text-xs">
                      <thead className="bg-muted/50 sticky top-0">
                        <tr>
                          <th className="text-left px-3 py-1.5 font-medium text-foreground">Row</th>
                          <th className="text-left px-3 py-1.5 font-medium text-foreground">Invoice</th>
                          <th className="text-left px-3 py-1.5 font-medium text-foreground">Reason</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(errorsData?.data ?? [])
                          .filter((row) => row.outcome === "failed")
                          .map((row) => (
                            <tr key={row.id} className="border-t border-border">
                              <td className="px-3 py-1.5 text-foreground">{row.sheet_row}</td>
                              <td className="px-3 py-1.5 text-foreground">{row.external_invoice_no}</td>
                              <td className="px-3 py-1.5 text-destructive">{row.error_message}</td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      <div className={adminDialogFooterClass}>
        <Button
          onClick={handleClose}
          disabled={isInFlight}
          className={cn(adminDialogFooterButtonClass, "bg-admin px-4 text-white hover:bg-admin/90")}
        >
          Done
        </Button>
      </div>
    </DialogContent>
  );
}

function SummaryTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-muted/50 px-3 py-2">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-semibold text-foreground truncate">{value}</p>
    </div>
  );
}
