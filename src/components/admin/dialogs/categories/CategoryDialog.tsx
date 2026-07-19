import { Button } from '@/components/ui/button';
import { ImagePreviewButton } from '@/components/common/ImagePreviewButton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  adminDialogBodyScrollClass,
  adminDialogContentClass,
  adminDialogFooterButtonClass,
  adminDialogFooterClass,
  adminDialogHeaderClass,
} from '@/lib/adminDialogContent';
import { ITEM_IMAGES_BUCKET, supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';
import { Upload } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { useRef, useState, type ChangeEvent } from 'react';
import { toast } from 'sonner';
import { useCreateCategory, useUpdateCategory } from '@/hooks/useCategories';
import type { Category } from '@/lib/api/categories';

interface CategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'add' | 'edit';
  category?: Category | null;
}

export function CategoryDialog({
  open,
  onOpenChange,
  mode,
  category,
}: CategoryDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <CategoryDialogBody
        key={`${mode}-${category?.id || 'new'}-${open ? 'open' : 'closed'}`}
        mode={mode}
        category={category}
        onOpenChange={onOpenChange}
      />
    </Dialog>
  );
}

interface CategoryDialogBodyProps {
  mode: 'add' | 'edit';
  category?: Category | null;
  onOpenChange: (open: boolean) => void;
}

function CategoryDialogBody({
  mode,
  category,
  onOpenChange,
}: CategoryDialogBodyProps) {
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();

  const [categoryName, setCategoryName] = useState(
    mode === 'edit' && category ? category.name : '',
  );
  const [isActive, setIsActive] = useState(
    mode === 'edit' && category ? category.status === 'active' : true,
  );
  const [imgUrl, setImgUrl] = useState(
    mode === 'edit' && category ? (category.imgUrl ?? '') : '',
  );
  const [minPrice, setMinPrice] = useState(
    mode === 'edit' && category?.minPrice != null ? String(category.minPrice) : '',
  );
  const [maxPrice, setMaxPrice] = useState(
    mode === 'edit' && category?.maxPrice != null ? String(category.maxPrice) : '',
  );
  const [avgPrice, setAvgPrice] = useState(
    mode === 'edit' && category?.avgPrice != null ? String(category.avgPrice) : '',
  );
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const isPending =
    mode === 'add' ? createCategory.isPending : updateCategory.isPending;

  const handleUploadClick = () => {
    imageInputRef.current?.click();
  };

  const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);
    try {
      const safeFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const filePath = `categories/${Date.now()}-${safeFileName}`;

      const { error: uploadError } = await supabase.storage
        .from(ITEM_IMAGES_BUCKET)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type || undefined,
        });

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from(ITEM_IMAGES_BUCKET)
        .getPublicUrl(filePath);

      setImgUrl(data.publicUrl);
      toast.success('Category image uploaded successfully');
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to upload image';
      toast.error(message);
    } finally {
      setIsUploadingImage(false);
      event.target.value = '';
    }
  };

  const parsePrice = (value: string): number | null | undefined => {
    const trimmed = value.trim();
    if (!trimmed) return mode === 'edit' ? null : undefined;
    return Number(trimmed);
  };

  const handleSubmit = () => {
    if (!categoryName.trim()) return;
    const min = parsePrice(minPrice);
    const max = parsePrice(maxPrice);
    const avg = parsePrice(avgPrice);
    for (const price of [min, max, avg]) {
      if (typeof price === 'number' && (!Number.isFinite(price) || price < 0)) {
        toast.error('Bird prices must be valid non-negative numbers');
        return;
      }
    }
    if (typeof min === 'number' && typeof max === 'number' && min > max) {
      toast.error('Min price per bird cannot be greater than max price');
      return;
    }
    const data = {
      name: categoryName.trim(),
      imgUrl: imgUrl.trim() || (mode === 'edit' ? null : undefined),
      status: isActive ? ('active' as const) : ('inactive' as const),
      minPrice: min,
      maxPrice: max,
      avgPrice: avg,
    };
    if (mode === 'add') {
      createCategory.mutate(data, { onSuccess: () => onOpenChange(false) });
    } else {
      updateCategory.mutate(
        { id: category!.id, data },
        { onSuccess: () => onOpenChange(false) },
      );
    }
  };

  return (
    <DialogContent
      className={adminDialogContentClass({
        className:
          'border-[rgba(0,0,0,0.1)] bg-white',
      })}
    >
      <DialogHeader className={adminDialogHeaderClass}>
        <DialogTitle className="text-xl font-semibold text-[#0a0a0a]  ">
          {mode === 'add' ? 'Add Category' : 'Edit Category'}
        </DialogTitle>
        <DialogDescription className="text-sm text-[#717182]">
          {mode === 'add'
            ? 'Create a new product category'
            : 'Update category information'}
        </DialogDescription>
      </DialogHeader>

      <div className={cn(adminDialogBodyScrollClass, 'space-y-4')}>
        <div className="space-y-2">
          <label
            htmlFor="categoryName"
            className="text-sm font-medium text-[#0a0a0a]"
          >
            Category Name
          </label>
          <Input
            id="categoryName"
            placeholder="Enter category name"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            className="bg-[#f3f3f5] border-transparent rounded-lg h-9 text-sm"
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <label
              htmlFor="status"
              className="text-sm font-medium text-[#0a0a0a]"
            >
              Status
            </label>
            <p className="text-sm text-[#525252]">
              Category is {isActive ? 'active' : 'inactive'}
            </p>
          </div>
          <Switch
            id="status"
            checked={isActive}
            onCheckedChange={setIsActive}
            className="data-checked:bg-toggle-on [&_[data-slot=switch-thumb]]:bg-white"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-[#0a0a0a]">
            Category Image (optional)
          </label>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleUploadClick}
              disabled={isUploadingImage}
              className="h-8 px-3 border border-[rgba(0,0,0,0.1)] text-[#0a0a0a]"
            >
              <Upload className="mr-2 size-4" />
              {isUploadingImage
                ? 'Uploading...'
                : imgUrl
                  ? 'Replace Image'
                  : 'Upload'}
            </Button>
            <ImagePreviewButton
              src={imgUrl}
              dialogTitle="Category image preview"
            />
            {imgUrl && (
              <Button
                type="button"
                variant="ghost"
                onClick={() => setImgUrl('')}
                className="h-8 px-2 text-xs text-[#525252]"
              >
                Remove
              </Button>
            )}
          </div>
          {imgUrl && <p className="text-xs text-[#717182] break-all">{imgUrl}</p>}
          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-[#0a0a0a]">
            Per-bird pricing (optional)
          </label>
          <p className="text-sm text-[#525252]">
            Only for bird categories like Nati, where a whole bird's price
            varies with its weight. Shown to customers as
            "Min · Max · Avg per bird".
          </p>
          <div className="grid grid-cols-3 gap-2">
            <div className="space-y-1">
              <label
                htmlFor="minPrice"
                className="text-xs font-medium text-[#525252]"
              >
                Min price (₹)
              </label>
              <Input
                id="minPrice"
                type="number"
                min="0"
                placeholder="e.g. 450"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="bg-[#f3f3f5] border-transparent rounded-lg h-9 text-sm"
              />
            </div>
            <div className="space-y-1">
              <label
                htmlFor="maxPrice"
                className="text-xs font-medium text-[#525252]"
              >
                Max price (₹)
              </label>
              <Input
                id="maxPrice"
                type="number"
                min="0"
                placeholder="e.g. 700"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="bg-[#f3f3f5] border-transparent rounded-lg h-9 text-sm"
              />
            </div>
            <div className="space-y-1">
              <label
                htmlFor="avgPrice"
                className="text-xs font-medium text-[#525252]"
              >
                Avg price (₹)
              </label>
              <Input
                id="avgPrice"
                type="number"
                min="0"
                placeholder="e.g. 550"
                value={avgPrice}
                onChange={(e) => setAvgPrice(e.target.value)}
                className="bg-[#f3f3f5] border-transparent rounded-lg h-9 text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      <div className={adminDialogFooterClass}>
        <Button
          variant="outline"
          onClick={() => onOpenChange(false)}
          className={cn(
            adminDialogFooterButtonClass,
            'border border-[rgba(0,0,0,0.1)] px-4 text-[#0a0a0a]',
          )}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={isPending || isUploadingImage || !categoryName.trim()}
          className={cn(
            adminDialogFooterButtonClass,
            'bg-admin px-4 text-white hover:bg-admin/90',
          )}
        >
          {isPending ? 'Saving...' : mode === 'add' ? 'Create' : 'Update'}
        </Button>
      </div>
    </DialogContent>
  );
}
