import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { useState } from 'react';
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

  const isPending =
    mode === 'add' ? createCategory.isPending : updateCategory.isPending;

  const handleSubmit = () => {
    if (!categoryName.trim()) return;
    const data = {
      name: categoryName.trim(),
      status: isActive ? ('active' as const) : ('inactive' as const),
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
    <DialogContent className="bg-white rounded-xl border border-[rgba(0,0,0,0.1)] p-6 max-w-[512px]! ">
      <DialogHeader className="mb-4">
        <DialogTitle className="text-xl font-semibold text-[#0a0a0a]  ">
          {mode === 'add' ? 'Add Category' : 'Edit Category'}
        </DialogTitle>
        <DialogDescription className="text-sm text-[#717182]">
          {mode === 'add'
            ? 'Create a new product category'
            : 'Update category information'}
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4">
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
      </div>

      <DialogFooter className="mt-6 gap-2">
        <Button
          variant="outline"
          onClick={() => onOpenChange(false)}
          className="h-9 px-4 border border-[rgba(0,0,0,0.1)] text-[#0a0a0a] rounded-lg"
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={isPending || !categoryName.trim()}
          className="h-9 px-4 bg-admin text-white hover:bg-admin/90 rounded-lg"
        >
          {isPending ? 'Saving...' : mode === 'add' ? 'Create' : 'Update'}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
