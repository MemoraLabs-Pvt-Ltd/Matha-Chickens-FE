import { useRef, useState, type ChangeEvent } from "react";
import { Calendar as CalendarIcon, Upload } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateDiscount, useUpdateDiscount } from "@/hooks/useDiscounts";
import { DISCOUNT_BANNERS_BUCKET, supabase } from "@/lib/supabase";
import type {
  CreateDiscountInput,
  Discount,
  DiscountStatus,
  DiscountType,
} from "@/lib/api/discounts";
import { parseApiDate } from "@/lib/display/formatting";

interface DiscountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "add" | "edit";
  discount?: Discount | null;
}

interface DiscountDialogBodyProps {
  mode: "add" | "edit";
  discount?: Discount | null;
  onOpenChange: (open: boolean) => void;
}

function toDateTimeLocal(value: string | Date): string {
  const date = parseApiDate(value);
  if (!date) return "";
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return localDate.toISOString().slice(0, 16);
}

function toDateTimeLocalFromTimestamp(timestamp: number): string {
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return "";
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return localDate.toISOString().slice(0, 16);
}

function parseDateTimeLocal(value: string): Date | undefined {
  if (!value.trim()) return undefined;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return undefined;
  return date;
}

function toApiDateTime(value: string): string {
  const date = parseDateTimeLocal(value);
  if (!date) return "";
  // Convert local wall-time to an actual UTC ISO string accepted by backend validation.
  return date.toISOString();
}

function formatDatePickerLabel(value: string): string {
  const date = parseDateTimeLocal(value);
  if (!date) return "Pick a date";
  return date.toLocaleDateString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatTimePickerValue(value: string): string {
  const date = parseDateTimeLocal(value);
  if (!date) return "";
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

function mergeDateAndTime(date: Date, timeValue: string): string {
  const [hoursText, minutesText] = timeValue.split(":");
  const hours = Number(hoursText);
  const minutes = Number(minutesText);
  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return "";

  const merged = new Date(date);
  merged.setHours(hours, minutes, 0, 0);
  return toDateTimeLocalFromTimestamp(merged.getTime());
}

function isValidUrl(value: string): boolean {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

function sanitizeNonNegativeNumberInput(value: string): string {
  if (!value.trim()) return "";
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return "";
  return parsed < 0 ? "0" : value;
}

export function DiscountDialog({
  open,
  onOpenChange,
  mode,
  discount,
}: DiscountDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DiscountDialogBody
        key={`${mode}-${discount?.id || "new"}-${open ? "open" : "closed"}`}
        mode={mode}
        discount={discount}
        onOpenChange={onOpenChange}
      />
    </Dialog>
  );
}

function DiscountDialogBody({
  mode,
  discount,
  onOpenChange,
}: DiscountDialogBodyProps) {
  const createDiscount = useCreateDiscount();
  const updateDiscount = useUpdateDiscount();

  const [title, setTitle] = useState(mode === "edit" && discount ? discount.title : "");
  const [description, setDescription] = useState(
    mode === "edit" && discount ? (discount.description ?? "") : "",
  );
  const [discountType, setDiscountType] = useState<DiscountType>(
    mode === "edit" && discount ? discount.discount_type : "percentage",
  );
  const [discountValue, setDiscountValue] = useState(
    mode === "edit" && discount ? String(discount.discount_value) : "",
  );
  const [startDate, setStartDate] = useState(
    mode === "edit" && discount ? toDateTimeLocal(discount.start_date) : "",
  );
  const [endDate, setEndDate] = useState(
    mode === "edit" && discount ? toDateTimeLocal(discount.end_date) : "",
  );
  const [bannerUrl, setBannerUrl] = useState(
    mode === "edit" && discount ? (discount.banner_url ?? "") : "",
  );
  const [status, setStatus] = useState<DiscountStatus>(
    mode === "edit" && discount ? discount.status : "active",
  );
  const [isUploadingBanner, setIsUploadingBanner] = useState(false);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  const parsedValue = Number(discountValue);
  const parsedStartDate = parseDateTimeLocal(startDate);
  const parsedEndDate = parseDateTimeLocal(endDate);
  const startTimestamp = parsedStartDate?.getTime() ?? NaN;
  const endTimestamp = parsedEndDate?.getTime() ?? NaN;
  const hasValidRange =
    Number.isFinite(startTimestamp) &&
    Number.isFinite(endTimestamp) &&
    endTimestamp > startTimestamp;

  const hasValidBannerUrl = !bannerUrl.trim() || isValidUrl(bannerUrl.trim());

  const canSubmit =
    title.trim().length > 0 &&
    discountValue.trim().length > 0 &&
    Number.isFinite(parsedValue) &&
    parsedValue >= 0 &&
    startDate.trim().length > 0 &&
    endDate.trim().length > 0 &&
    hasValidRange &&
    hasValidBannerUrl &&
    !isUploadingBanner;

  const isPending = mode === "add" ? createDiscount.isPending : updateDiscount.isPending;

  const handleUploadClick = () => {
    bannerInputRef.current?.click();
  };

  const handleBannerUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploadingBanner(true);
    try {
      const safeFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const filePath = `discounts/${Date.now()}-${safeFileName}`;

      const { error: uploadError } = await supabase.storage
        .from(DISCOUNT_BANNERS_BUCKET)
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
          contentType: file.type || undefined,
        });

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from(DISCOUNT_BANNERS_BUCKET)
        .getPublicUrl(filePath);

      setBannerUrl(data.publicUrl);
      toast.success("Banner uploaded successfully");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to upload banner";
      toast.error(message);
    } finally {
      setIsUploadingBanner(false);
      event.target.value = "";
    }
  };

  const handleStartDateChange = (value: string) => {
    setStartDate(value);

    if (!value.trim() || !endDate.trim()) return;

    const nextStartTime = new Date(value).getTime();
    const currentEndTime = new Date(endDate).getTime();

    if (!Number.isFinite(nextStartTime) || !Number.isFinite(currentEndTime)) return;
    if (currentEndTime > nextStartTime) return;

    // Keep form valid by nudging end time one hour after updated start time.
    setEndDate(toDateTimeLocalFromTimestamp(nextStartTime + 60 * 60 * 1000));
  };

  const handleStartDateSelect = (value?: Date) => {
    if (!value) return;
    const baseline = parsedStartDate ?? new Date();
    const next = new Date(value);
    next.setHours(baseline.getHours(), baseline.getMinutes(), 0, 0);
    handleStartDateChange(toDateTimeLocalFromTimestamp(next.getTime()));
  };

  const handleStartTimeChange = (value: string) => {
    if (!parsedStartDate) return;
    const mergedDateTime = mergeDateAndTime(parsedStartDate, value);
    if (!mergedDateTime) return;
    handleStartDateChange(mergedDateTime);
  };

  const handleEndDateSelect = (value?: Date) => {
    if (!value) return;
    const baseline =
      parsedEndDate ??
      (parsedStartDate
        ? new Date(parsedStartDate.getTime() + 60 * 60 * 1000)
        : new Date());
    const next = new Date(value);
    next.setHours(baseline.getHours(), baseline.getMinutes(), 0, 0);
    setEndDate(toDateTimeLocalFromTimestamp(next.getTime()));
  };

  const handleEndTimeChange = (value: string) => {
    if (!parsedEndDate) return;
    const mergedDateTime = mergeDateAndTime(parsedEndDate, value);
    if (!mergedDateTime) return;
    setEndDate(mergedDateTime);
  };

  const disableEndDateBeforeStart = (value: Date) => {
    if (!parsedStartDate) return false;
    const startOfStartDate = new Date(parsedStartDate);
    startOfStartDate.setHours(0, 0, 0, 0);
    return value < startOfStartDate;
  };

  const handleSubmit = () => {
    if (!canSubmit) return;

    const startDatePayload = toApiDateTime(startDate);
    const endDatePayload = toApiDateTime(endDate);
    if (!startDatePayload || !endDatePayload) return;

    const payload: CreateDiscountInput = {
      title: title.trim(),
      description: description.trim() || undefined,
      discount_type: discountType,
      discount_value: parsedValue,
      start_date: startDatePayload,
      end_date: endDatePayload,
      banner_url: bannerUrl.trim() || undefined,
      status,
    };

    if (mode === "add") {
      createDiscount.mutate(payload, { onSuccess: () => onOpenChange(false) });
      return;
    }

    if (!discount) return;

    updateDiscount.mutate(
      { id: discount.id, data: payload },
      { onSuccess: () => onOpenChange(false) },
    );
  };

  return (
    <DialogContent className="bg-card rounded-xl border border-border p-0 max-w-[600px]!">
      <DialogHeader className="px-6 pt-6 pb-4 border-b border-border shrink-0">
        <DialogTitle>
          {mode === "add" ? "Add Discount Campaign" : "Edit Discount Campaign"}
        </DialogTitle>
        <DialogDescription>
          {mode === "add"
            ? "Create a global discount campaign"
            : "Update campaign details"}
        </DialogDescription>
      </DialogHeader>

      <div className="px-6 py-4 space-y-4 max-h-[70vh] overflow-y-auto">
        <div className="space-y-2">
          <Label htmlFor="discountTitle" className="text-sm font-medium text-foreground">
            Title *
          </Label>
          <Input
            id="discountTitle"
            placeholder="e.g. Summer Sale"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="bg-input border-transparent rounded-lg h-9 text-sm"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="discountDescription" className="text-sm font-medium text-foreground">
            Description
          </Label>
          <Textarea
            id="discountDescription"
            placeholder="Optional campaign details"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            className="bg-input border-transparent rounded-lg min-h-[88px] text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground">Discount Type *</Label>
            <Select
              value={discountType}
              onValueChange={(value) => setDiscountType(value as DiscountType)}
            >
              <SelectTrigger className="bg-input border-transparent rounded-lg h-9 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="percentage">Percentage</SelectItem>
                <SelectItem value="flat">Flat</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="discountValue" className="text-sm font-medium text-foreground">
              Discount Value *
            </Label>
            <Input
              id="discountValue"
              type="number"
              min={0}
              value={discountValue}
              onChange={(event) =>
                setDiscountValue(sanitizeNonNegativeNumberInput(event.target.value))
              }
              className="bg-input border-transparent rounded-lg h-9 text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="startDateTrigger" className="text-sm font-medium text-foreground">
              Start Date *
            </Label>
            <div className="grid grid-cols-[1fr_120px] gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="startDateTrigger"
                    type="button"
                    variant="outline"
                    className="h-9 justify-start rounded-lg border-transparent bg-input px-3 text-sm text-foreground hover:bg-admin-accent/70 focus-visible:ring-admin/40"
                  >
                    <CalendarIcon className="mr-2 size-4 text-admin" />
                    {formatDatePickerLabel(startDate)}
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="start" className="w-auto border border-border bg-card p-2">
                  <Calendar
                    mode="single"
                    selected={parsedStartDate}
                    onSelect={handleStartDateSelect}
                    classNames={{
                      day_button:
                        "h-9 w-9 rounded-md p-0 font-normal text-foreground hover:bg-admin-accent/80 hover:text-foreground aria-selected:bg-admin aria-selected:text-admin-foreground aria-selected:hover:bg-admin/90",
                      today: "bg-admin-accent text-admin",
                    }}
                  />
                </PopoverContent>
              </Popover>
              <Input
                id="startDate"
                type="time"
                value={formatTimePickerValue(startDate)}
                onChange={(event) => handleStartTimeChange(event.target.value)}
                disabled={!parsedStartDate}
                className="bg-input border-transparent rounded-lg h-9 text-sm disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="endDateTrigger" className="text-sm font-medium text-foreground">
              End Date *
            </Label>
            <div className="grid grid-cols-[1fr_120px] gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="endDateTrigger"
                    type="button"
                    variant="outline"
                    className="h-9 justify-start rounded-lg border-transparent bg-input px-3 text-sm text-foreground hover:bg-admin-accent/70 focus-visible:ring-admin/40"
                  >
                    <CalendarIcon className="mr-2 size-4 text-admin" />
                    {formatDatePickerLabel(endDate)}
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="start" className="w-auto border border-border bg-card p-2">
                  <Calendar
                    mode="single"
                    selected={parsedEndDate}
                    onSelect={handleEndDateSelect}
                    disabled={disableEndDateBeforeStart}
                    classNames={{
                      day_button:
                        "h-9 w-9 rounded-md p-0 font-normal text-foreground hover:bg-admin-accent/80 hover:text-foreground aria-selected:bg-admin aria-selected:text-admin-foreground aria-selected:hover:bg-admin/90",
                      today: "bg-admin-accent text-admin",
                    }}
                  />
                </PopoverContent>
              </Popover>
              <Input
                id="endDate"
                type="time"
                value={formatTimePickerValue(endDate)}
                onChange={(event) => handleEndTimeChange(event.target.value)}
                disabled={!parsedEndDate}
                className="bg-input border-transparent rounded-lg h-9 text-sm disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>
          </div>
        </div>
        {startDate.trim().length > 0 &&
          endDate.trim().length > 0 &&
          !hasValidRange && (
            <p className="text-xs text-destructive">
              End date and time must be later than the start date and time.
            </p>
          )}

        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground">
            Banner (optional)
          </Label>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleUploadClick}
              disabled={isUploadingBanner}
              className="h-8 px-3 border-border text-foreground"
            >
              <Upload className="size-4 mr-2" />
              {isUploadingBanner
                ? "Uploading..."
                : bannerUrl
                  ? "Replace Banner"
                  : "Upload Banner"}
            </Button>
            {bannerUrl && (
              <Button
                type="button"
                variant="ghost"
                onClick={() => setBannerUrl("")}
                className="h-8 px-2 text-xs text-muted-foreground"
              >
                Remove
              </Button>
            )}
          </div>
          {bannerUrl && (
            <p className="text-xs text-muted-foreground break-all">
              {bannerUrl}
            </p>
          )}
          <input
            ref={bannerInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleBannerUpload}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground">Status</Label>
          <Select value={status} onValueChange={(value) => setStatus(value as DiscountStatus)}>
            <SelectTrigger className="bg-input border-transparent rounded-lg h-9 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="shrink-0 border-t border-border bg-muted/50 px-6 py-4 flex justify-end gap-2">
        <Button
          variant="outline"
          onClick={() => onOpenChange(false)}
          className="h-9 px-4 border border-border text-foreground rounded-lg"
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={isPending || !canSubmit || isUploadingBanner}
          className="h-9 px-4 bg-admin text-white hover:bg-admin/90 rounded-lg"
        >
          {isPending ? "Saving..." : mode === "add" ? "Create" : "Save"}
        </Button>
      </div>
    </DialogContent>
  );
}
