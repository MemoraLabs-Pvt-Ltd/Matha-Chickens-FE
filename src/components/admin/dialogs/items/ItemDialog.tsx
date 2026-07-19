import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { Upload } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ImagePreviewButton } from "@/components/common/ImagePreviewButton";
import {
  adminDialogBodyScrollClass,
  adminDialogContentClass,
  adminDialogFooterButtonClass,
  adminDialogFooterClass,
  adminDialogHeaderClass,
} from "@/lib/adminDialogContent";
import { cn } from "@/lib/utils";
import { useCreateItem, useUpdateItem } from "@/hooks/useItems";
import { useUpdateCategory } from "@/hooks/useCategories";
import { ITEM_IMAGES_BUCKET, supabase } from "@/lib/supabase";
import {
  UNIT_OPTIONS,
  type CreateItemInput,
  type Item,
} from "@/lib/api/items";

interface ItemDialogCategory {
  id: number;
  name: string;
  status: "active" | "inactive";
  minPrice?: number | null;
  maxPrice?: number | null;
  avgPrice?: number | null;
}

interface ItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "add" | "edit";
  item?: Item | null;
  categories: ItemDialogCategory[];
}

export function ItemDialog({
  open,
  onOpenChange,
  mode,
  item,
  categories,
}: ItemDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <ItemDialogBody
        key={`${mode}-${item?.id ?? "new"}-${open ? "open" : "closed"}`}
        mode={mode}
        item={item}
        categories={categories}
        onOpenChange={onOpenChange}
      />
    </Dialog>
  );
}

interface ItemDialogBodyProps {
  mode: "add" | "edit";
  item?: Item | null;
  categories: ItemDialogCategory[];
  onOpenChange: (open: boolean) => void;
}

function birdPriceLabel(category?: ItemDialogCategory): string | null {
  if (!category) return null;
  const parts = [
    category.minPrice != null ? `Min ₹${category.minPrice}` : null,
    category.maxPrice != null ? `Max ₹${category.maxPrice}` : null,
    category.avgPrice != null ? `Avg ₹${category.avgPrice}` : null,
  ].filter(Boolean);
  return parts.length > 0 ? parts.join(" · ") : null;
}

type DiscountType = "none" | "percentage" | "flat";

function normalizeDiscountType(value: string | null | undefined): DiscountType {
  if (value === "percentage" || value === "flat" || value === "none") {
    return value;
  }
  return "none";
}

function sanitizeNonNegativeNumberInput(value: string): string {
  if (!value.trim()) return "";
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return "";
  return parsed < 0 ? "0" : value;
}

function ItemDialogBody({
  mode,
  item,
  categories,
  onOpenChange,
}: ItemDialogBodyProps) {
  const createItem = useCreateItem();
  const updateItem = useUpdateItem();
  const updateCategory = useUpdateCategory();

  const initialTaxPercentage =
    mode === "edit" && item ? String(item.gst_percent ?? 0) : "5";

  const [itemName, setItemName] = useState(
    mode === "edit" && item ? item.name : "",
  );
  const [categoryId, setCategoryId] = useState(
    mode === "edit" && item ? String(item.category_id) : "",
  );
  const [price, setPrice] = useState(
    mode === "edit" && item ? String(item.price) : "",
  );
  const [unit, setUnit] = useState(
    mode === "edit" && item ? item.unit : "kg",
  );
  const [description, setDescription] = useState(
    mode === "edit" && item ? item.description ?? "" : "",
  );
  const [imageUrl, setImageUrl] = useState(
    mode === "edit" && item ? item.image_url ?? "" : "",
  );
  const [taxes, setTaxes] = useState([
    { id: "gst", name: "GST", percentage: initialTaxPercentage },
  ]);
  const [discountType, setDiscountType] = useState<DiscountType>(
    normalizeDiscountType(mode === "edit" && item ? item.discount_type : "none"),
  );
  const [discountValue, setDiscountValue] = useState(
    mode === "edit" && item ? String(item.discount_value ?? 0) : "0",
  );
  const [isActive, setIsActive] = useState(
    mode === "edit" && item ? item.status !== "inactive" : true,
  );
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const isPending =
    mode === "add" ? createItem.isPending : updateItem.isPending;

  const selectedCategory = categories.find(
    (cat) => String(cat.id) === categoryId,
  );
  const selectedBirdPriceLabel = birdPriceLabel(selectedCategory);
  const isBirdUnit = unit.trim().toLowerCase() === "bird";
  const priceUnitLabel = isBirdUnit ? "kg" : unit || "kg";

  const [birdMinPrice, setBirdMinPrice] = useState("");
  const [birdMaxPrice, setBirdMaxPrice] = useState("");
  const [birdAvgPrice, setBirdAvgPrice] = useState("");
  const prefilledCategoryIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!selectedCategory) return;
    if (prefilledCategoryIdRef.current === selectedCategory.id) return;
    prefilledCategoryIdRef.current = selectedCategory.id;
    setBirdMinPrice(
      selectedCategory.minPrice != null ? String(selectedCategory.minPrice) : "",
    );
    setBirdMaxPrice(
      selectedCategory.maxPrice != null ? String(selectedCategory.maxPrice) : "",
    );
    setBirdAvgPrice(
      selectedCategory.avgPrice != null ? String(selectedCategory.avgPrice) : "",
    );
  }, [selectedCategory]);

  const addTax = () => {
    setTaxes((prev) => [
      ...prev,
      { id: Date.now().toString(), name: "", percentage: "0" },
    ]);
  };

  const removeTax = (id: string) => {
    setTaxes((prev) => prev.filter((t) => t.id !== id));
  };

  const updateTax = (
    id: string,
    field: "name" | "percentage",
    value: string,
  ) => {
    setTaxes((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              [field]:
                field === "percentage"
                  ? sanitizeNonNegativeNumberInput(value)
                  : value,
            }
          : t,
      ),
    );
  };

  const basePrice = Number(price) || 0;
  const totalTaxPercentage = taxes.reduce(
    (sum, t) => sum + (Number(t.percentage) || 0),
    0,
  );
  const parsedDiscountValue = Number(discountValue) || 0;
  const discountAmount =
    discountType === "percentage"
      ? basePrice * (parsedDiscountValue / 100)
      : discountType === "flat"
        ? parsedDiscountValue
        : 0;
  const afterDiscount = Math.max(0, basePrice - discountAmount);
  // List/selling price is GST-inclusive (same as offline_bills). Item discount applies to that
  // inclusive amount; GST is not stacked on top of the pre-discount list price.
  const finalPriceInclusive = afterDiscount;
  const exGstInFinal =
    totalTaxPercentage > 0
      ? (afterDiscount * 100) / (100 + totalTaxPercentage)
      : afterDiscount;
  const gstIncludedInFinal = afterDiscount - exGstInFinal;
  const savings = discountAmount;

  const canSubmit =
    itemName.trim().length > 0 &&
    categoryId.trim().length > 0 &&
    unit.trim().length > 0 &&
    price.trim().length > 0 &&
    Number(price) >= 0 &&
    !isUploadingImage;

  const handleUploadClick = () => {
    imageInputRef.current?.click();
  };

  const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);
    try {
      const safeFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const filePath = `items/${Date.now()}-${safeFileName}`;

      const { error: uploadError } = await supabase.storage
        .from(ITEM_IMAGES_BUCKET)
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
          contentType: file.type || undefined,
        });

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from(ITEM_IMAGES_BUCKET)
        .getPublicUrl(filePath);

      setImageUrl(data.publicUrl);
      toast.success("Image uploaded successfully");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to upload image";
      toast.error(message);
    } finally {
      setIsUploadingImage(false);
      event.target.value = "";
    }
  };

  const handleSubmit = () => {
    const parsedCategoryId = Number(categoryId);
    const parsedPrice = Number(price);
    if (
      !itemName.trim() ||
      !Number.isFinite(parsedCategoryId) ||
      parsedCategoryId <= 0 ||
      !unit.trim() ||
      !Number.isFinite(parsedPrice) ||
      parsedPrice < 0
    ) {
      return;
    }

    if (isBirdUnit && selectedCategory) {
      const min = birdMinPrice.trim() ? Number(birdMinPrice) : null;
      const max = birdMaxPrice.trim() ? Number(birdMaxPrice) : null;
      const avg = birdAvgPrice.trim() ? Number(birdAvgPrice) : null;
      for (const value of [min, max, avg]) {
        if (value !== null && (!Number.isFinite(value) || value < 0)) {
          toast.error("Bird prices must be valid non-negative numbers");
          return;
        }
      }
      if (min !== null && max !== null && min > max) {
        toast.error("Min price per bird cannot be greater than max price");
        return;
      }
      const changed =
        min !== (selectedCategory.minPrice ?? null) ||
        max !== (selectedCategory.maxPrice ?? null) ||
        avg !== (selectedCategory.avgPrice ?? null);
      if (changed) {
        updateCategory.mutate({
          id: selectedCategory.id,
          data: {
            name: selectedCategory.name,
            status: selectedCategory.status,
            minPrice: min,
            maxPrice: max,
            avgPrice: avg,
          },
        });
      }
    }

    const payload: CreateItemInput = {
      category_id: parsedCategoryId,
      name: itemName.trim(),
      description: description.trim() || undefined,
      price: parsedPrice,
      unit,
      gst_percent: Math.max(0, totalTaxPercentage),
      discount_type: discountType,
      discount_value: discountType === "none" ? 0 : Math.max(0, parsedDiscountValue),
      image_url: imageUrl.trim() || undefined,
      status: isActive ? "active" : "inactive",
    };

    if (mode === "add") {
      createItem.mutate(payload, { onSuccess: () => onOpenChange(false) });
      return;
    }

    if (!item) return;
    updateItem.mutate(
      { id: item.id, data: payload },
      { onSuccess: () => onOpenChange(false) },
    );
  };

  return (
    <DialogContent className={adminDialogContentClass()}>
      <DialogHeader className={adminDialogHeaderClass}>
        <DialogTitle className="text-lg font-semibold text-foreground">
          {mode === "add" ? "Add Item" : "Edit Item"}
        </DialogTitle>
        <DialogDescription className="text-sm text-muted-foreground">
          {mode === "add"
            ? "Create a new product item"
            : "Update item information"}
        </DialogDescription>
      </DialogHeader>

      <div className={cn(adminDialogBodyScrollClass, "space-y-3")}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label
              htmlFor="itemName"
              className="text-sm font-medium text-foreground"
            >
              Item Name *
            </Label>
            <Input
              id="itemName"
              placeholder={
                mode === "add" ? "Enter item name" : "Fresh Chicken Breast"
              }
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              className="bg-input border-transparent rounded-lg h-9 text-sm"
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="category"
              className="text-sm font-medium text-foreground"
            >
              Category *
            </Label>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger className="w-full h-9 bg-input border-transparent rounded-lg text-sm text-foreground">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={String(cat.id)}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {isBirdUnit && (
          <div className="bg-[#FFF7ED] rounded-lg px-3 py-3 space-y-2">
            <p className="text-xs font-medium text-[#9A3412]">
              Per-bird price range
              {selectedCategory ? ` — ${selectedCategory.name}` : ""}
            </p>
            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-1">
                <Label
                  htmlFor="birdMinPrice"
                  className="text-xs text-[#9A3412]"
                >
                  Min (₹)
                </Label>
                <Input
                  id="birdMinPrice"
                  type="number"
                  min={0}
                  placeholder="450"
                  value={birdMinPrice}
                  onChange={(e) =>
                    setBirdMinPrice(
                      sanitizeNonNegativeNumberInput(e.target.value),
                    )
                  }
                  className="bg-white border-transparent rounded-lg h-9 text-sm"
                />
              </div>
              <div className="space-y-1">
                <Label
                  htmlFor="birdMaxPrice"
                  className="text-xs text-[#9A3412]"
                >
                  Max (₹)
                </Label>
                <Input
                  id="birdMaxPrice"
                  type="number"
                  min={0}
                  placeholder="700"
                  value={birdMaxPrice}
                  onChange={(e) =>
                    setBirdMaxPrice(
                      sanitizeNonNegativeNumberInput(e.target.value),
                    )
                  }
                  className="bg-white border-transparent rounded-lg h-9 text-sm"
                />
              </div>
              <div className="space-y-1">
                <Label
                  htmlFor="birdAvgPrice"
                  className="text-xs text-[#9A3412]"
                >
                  Avg (₹)
                </Label>
                <Input
                  id="birdAvgPrice"
                  type="number"
                  min={0}
                  placeholder="550"
                  value={birdAvgPrice}
                  onChange={(e) =>
                    setBirdAvgPrice(
                      sanitizeNonNegativeNumberInput(e.target.value),
                    )
                  }
                  className="bg-white border-transparent rounded-lg h-9 text-sm"
                />
              </div>
            </div>
            <p className="text-xs text-[#C2410C]">
              Saved on the {selectedCategory?.name ?? "selected"} category and
              shown per bird to customers on all its items.
            </p>
          </div>
        )}
        {!isBirdUnit && selectedBirdPriceLabel && (
          <div className="bg-[#FFF7ED] rounded-lg px-3 py-2">
            <p className="text-xs font-medium text-[#9A3412]">
              Per-bird price range: {selectedBirdPriceLabel}
            </p>
            <p className="text-xs text-[#C2410C]">
              Customers will see this range per bird on items in this
              category, along with the selling price per {unit || "kg"}.
            </p>
          </div>
        )}

        <div className="space-y-2">
          <Label
            htmlFor="price"
            className="text-sm font-medium text-foreground"
          >
            Selling Price (₹/{priceUnitLabel}) *
          </Label>
          <Input
            id="price"
            type="number"
            min={0}
            placeholder={mode === "add" ? "0" : "280"}
            value={price}
            onChange={(e) =>
              setPrice(sanitizeNonNegativeNumberInput(e.target.value))
            }
            className="flex-1 bg-input border-transparent rounded-lg h-9 text-sm"
          />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="unit"
            className="text-sm font-medium text-foreground"
          >
            Unit *
          </Label>
          <Select value={unit} onValueChange={setUnit}>
            <SelectTrigger id="unit" className="w-full h-9 bg-input border-transparent rounded-lg text-sm text-foreground">
              <SelectValue placeholder="Select unit" />
            </SelectTrigger>
            <SelectContent>
              {UNIT_OPTIONS.map((unitOption) => (
                <SelectItem key={unitOption} value={unitOption}>
                  {unitOption}
                </SelectItem>
              ))}
              {!UNIT_OPTIONS.includes(unit as (typeof UNIT_OPTIONS)[number]) && unit.trim().length > 0 && (
                <SelectItem value={unit}>
                  {unit} (current)
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="description"
            className="text-sm font-medium text-foreground"
          >
            Description (optional)
          </Label>
          <textarea
            id="description"
            placeholder="Enter item description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="bg-input border-transparent rounded-lg px-3 py-2 text-sm min-h-[64px] w-full resize-none"
          />
        </div>

        <div className="border-t border-border pt-3 space-y-3">
          <h3 className="text-base font-semibold text-foreground">
            Tax & Discount
          </h3>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-foreground">
                Taxes
              </Label>
              <Button
                type="button"
                variant="ghost"
                onClick={addTax}
                className="h-7 px-2 text-xs text-admin hover:text-admin/80"
              >
                + Add Tax
              </Button>
            </div>
            <div className="space-y-2">
              {taxes.map((tax) => (
                <div key={tax.id} className="flex items-center gap-2">
                  <Input
                    placeholder="Tax name (e.g., GST)"
                    value={tax.name}
                    onChange={(e) => updateTax(tax.id, "name", e.target.value)}
                    className="flex-1 bg-input border-transparent rounded-lg h-9 text-sm"
                  />
                  <Input
                    type="number"
                    min={0}
                    placeholder="%"
                    value={tax.percentage}
                    onChange={(e) =>
                      updateTax(tax.id, "percentage", e.target.value)
                    }
                    className="w-20 bg-input border-transparent rounded-lg h-9 text-sm"
                  />
                  {taxes.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => removeTax(tax.id)}
                      className="size-8 hover:bg-destructive/10 text-destructive"
                    >
                      ×
                    </Button>
                  )}
                </div>
              ))}
            </div>
            {taxes.length > 0 && (
              <p className="text-xs text-muted-foreground">
                Total Tax: {totalTaxPercentage}%
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-2">
              <Label
                htmlFor="discountType"
                className="text-sm font-medium text-foreground"
              >
                Discount Type
              </Label>
              <Select
                value={discountType}
                onValueChange={(value) => setDiscountType(value as DiscountType)}
              >
                <SelectTrigger className="w-full h-9 bg-input border-transparent rounded-lg text-sm text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="percentage">Percentage (%)</SelectItem>
                  <SelectItem value="flat">Flat (₹)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="discountValue"
                className="text-sm font-medium text-foreground"
              >
                Discount
              </Label>
              <Input
                id="discountValue"
                type="number"
                min={0}
                placeholder="0"
                value={discountValue}
                onChange={(e) =>
                  setDiscountValue(sanitizeNonNegativeNumberInput(e.target.value))
                }
                disabled={discountType === "none"}
                className="bg-input border-transparent rounded-lg h-9 text-sm disabled:opacity-50"
              />
            </div>
          </div>

          {mode === "edit" && (
            <div className="bg-[#FAF5FF] rounded-lg p-4 space-y-3">
              <h4 className="text-sm font-medium text-[#59168B]">
                Price Preview (per {priceUnitLabel}, incl. GST)
              </h4>
              <div className="flex flex-wrap items-start gap-6">
                {savings > 0 ? (
                  <>
                    <div className="space-y-0.5">
                      <p className="text-xs text-muted-foreground">
                        List price (incl. GST)
                      </p>
                      <p className="text-base font-semibold text-muted-foreground line-through">
                        ₹{basePrice.toFixed(2)}
                      </p>
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-xs text-muted-foreground">
                        After item discount
                      </p>
                      <p className="text-base font-semibold text-[#00A63E]">
                        ₹{afterDiscount.toFixed(2)}
                      </p>
                    </div>
                    <div className="px-2.5 py-1 bg-[#DCFCE7] rounded-full self-center">
                      <p className="text-xs font-medium text-[#00A63E]">
                        Save ₹{savings.toFixed(2)}
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="space-y-0.5">
                    <p className="text-xs text-muted-foreground">
                      Selling price (incl. GST)
                    </p>
                    <p className="text-base font-semibold text-foreground">
                      ₹{finalPriceInclusive.toFixed(2)}
                    </p>
                  </div>
                )}
                <div className="space-y-0.5 min-w-[120px]">
                  <p className="text-xs text-foreground">You pay (incl. GST)</p>
                  <p className="text-lg font-semibold text-[#9810FA]">
                    ₹{finalPriceInclusive.toFixed(2)}
                  </p>
                </div>
              </div>
              {totalTaxPercentage > 0 && (
                <p className="text-xs text-muted-foreground border-t border-[#E9D5FF] pt-3">
                  GST split of amount above: ex-GST ₹{exGstInFinal.toFixed(2)} · GST (
                  {totalTaxPercentage}%) ₹{gstIncludedInFinal.toFixed(2)}
                </p>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label className="text-sm font-medium text-foreground">
              Status
            </Label>
            <p className="text-sm text-muted-foreground">
              Item is {isActive ? "active" : "inactive"}
            </p>
          </div>
          <Switch
            checked={isActive}
            onCheckedChange={setIsActive}
            className="data-checked:bg-toggle-on [&_[data-slot=switch-thumb]]:bg-white"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground">
            Upload Image (optional)
          </Label>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleUploadClick}
              disabled={isUploadingImage}
              className="h-8 px-3 border-border text-foreground"
            >
              <Upload className="size-4 mr-2" />
              {isUploadingImage ? "Uploading..." : imageUrl ? "Replace Image" : "Upload"}
            </Button>
            <ImagePreviewButton
              src={imageUrl}
              dialogTitle="Item image preview"
            />
            {imageUrl && (
              <Button
                type="button"
                variant="ghost"
                onClick={() => setImageUrl("")}
                className="h-8 px-2 text-xs text-muted-foreground"
              >
                Remove
              </Button>
            )}
          </div>
          {imageUrl && (
            <p className="text-xs text-muted-foreground break-all">
              {imageUrl}
            </p>
          )}
          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />
        </div>
      </div>

      <div className={adminDialogFooterClass}>
        <Button
          variant="outline"
          onClick={() => onOpenChange(false)}
          className={cn(
            adminDialogFooterButtonClass,
            "border border-border px-4 text-foreground",
          )}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={isPending || !canSubmit || isUploadingImage}
          className={cn(
            adminDialogFooterButtonClass,
            "bg-admin px-4 text-primary-foreground hover:bg-admin/90",
          )}
        >
          {isPending ? "Saving..." : mode === "add" ? "Create" : "Update"}
        </Button>
      </div>
    </DialogContent>
  );
}
