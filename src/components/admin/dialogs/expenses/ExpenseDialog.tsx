import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  adminDialogBodyScrollClass,
  adminDialogContentClass,
  adminDialogFooterButtonClass,
  adminDialogFooterClass,
  adminDialogHeaderClass,
} from "@/lib/adminDialogContent";
import { cn } from "@/lib/utils";
import { useCreateExpense, useUpdateExpense } from "@/hooks/useExpenses";
import type { CreateExpenseInput, Expense } from "@/lib/api/expenses";

interface ExpenseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "add" | "edit";
  expense?: Expense | null;
}

interface ExpenseDialogBodyProps {
  mode: "add" | "edit";
  expense?: Expense | null;
  onOpenChange: (open: boolean) => void;
}

function toDateInputValue(value: string): string {
  const match = value.match(/^\d{4}-\d{2}-\d{2}/);
  return match ? match[0] : "";
}

function todayDateInputValue(): string {
  const now = new Date();
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 10);
}

function sanitizeNonNegativeNumberInput(value: string): string {
  if (!value.trim()) return "";
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return "";
  return parsed < 0 ? "0" : value;
}

export function ExpenseDialog({
  open,
  onOpenChange,
  mode,
  expense,
}: ExpenseDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <ExpenseDialogBody
        key={`${mode}-${expense?.id ?? "new"}-${open ? "open" : "closed"}`}
        mode={mode}
        expense={expense}
        onOpenChange={onOpenChange}
      />
    </Dialog>
  );
}

function ExpenseDialogBody({
  mode,
  expense,
  onOpenChange,
}: ExpenseDialogBodyProps) {
  const createExpense = useCreateExpense();
  const updateExpense = useUpdateExpense();

  const [title, setTitle] = useState(
    mode === "edit" && expense ? expense.title : "",
  );
  const [category, setCategory] = useState(
    mode === "edit" && expense ? (expense.category ?? "") : "",
  );
  const [amount, setAmount] = useState(
    mode === "edit" && expense ? String(expense.amount) : "",
  );
  const [expenseDate, setExpenseDate] = useState(
    mode === "edit" && expense
      ? toDateInputValue(expense.expense_date)
      : todayDateInputValue(),
  );
  const [notes, setNotes] = useState(
    mode === "edit" && expense ? (expense.notes ?? "") : "",
  );

  const parsedAmount = Number(amount);

  const isPending =
    mode === "add" ? createExpense.isPending : updateExpense.isPending;

  const canSubmit =
    title.trim().length > 0 &&
    amount.trim().length > 0 &&
    Number.isFinite(parsedAmount) &&
    parsedAmount >= 0 &&
    expenseDate.trim().length > 0;

  const handleSubmit = () => {
    if (!canSubmit) return;

    const payload: CreateExpenseInput = {
      title: title.trim(),
      category: category.trim() || undefined,
      amount: parsedAmount,
      expense_date: expenseDate,
      notes: notes.trim() || undefined,
    };

    if (mode === "add") {
      createExpense.mutate(payload, { onSuccess: () => onOpenChange(false) });
      return;
    }

    if (!expense) return;

    updateExpense.mutate(
      { id: expense.id, data: payload },
      { onSuccess: () => onOpenChange(false) },
    );
  };

  return (
    <DialogContent className={adminDialogContentClass()}>
      <DialogHeader className={adminDialogHeaderClass}>
        <DialogTitle className="text-lg font-semibold text-foreground">
          {mode === "add" ? "Add Expense" : "Edit Expense"}
        </DialogTitle>
        <DialogDescription className="text-sm text-muted-foreground">
          {mode === "add" ? "Log a new expense" : "Update expense details"}
        </DialogDescription>
      </DialogHeader>

      <div className={cn(adminDialogBodyScrollClass, "space-y-4")}>
        <div className="space-y-2">
          <Label htmlFor="expenseTitle" className="text-sm font-medium text-foreground">
            Title *
          </Label>
          <Input
            id="expenseTitle"
            placeholder="e.g. Electricity Bill"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="bg-input border-transparent rounded-lg h-9 text-sm"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="expenseAmount" className="text-sm font-medium text-foreground">
              Amount *
            </Label>
            <Input
              id="expenseAmount"
              type="number"
              min={0}
              placeholder="0"
              value={amount}
              onChange={(event) =>
                setAmount(sanitizeNonNegativeNumberInput(event.target.value))
              }
              className="bg-input border-transparent rounded-lg h-9 text-sm"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="expenseDate" className="text-sm font-medium text-foreground">
              Date *
            </Label>
            <Input
              id="expenseDate"
              type="date"
              value={expenseDate}
              onChange={(event) => setExpenseDate(event.target.value)}
              className="bg-input border-transparent rounded-lg h-9 text-sm"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="expenseCategory" className="text-sm font-medium text-foreground">
            Category
          </Label>
          <Input
            id="expenseCategory"
            placeholder="e.g. Utilities, Rent, Transport"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="bg-input border-transparent rounded-lg h-9 text-sm"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="expenseNotes" className="text-sm font-medium text-foreground">
            Notes
          </Label>
          <Textarea
            id="expenseNotes"
            placeholder="Optional details"
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            className="bg-input border-transparent rounded-lg min-h-[64px] text-sm"
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
          disabled={isPending || !canSubmit}
          className={cn(
            adminDialogFooterButtonClass,
            "bg-admin px-4 text-white hover:bg-admin/90",
          )}
        >
          {isPending ? "Saving..." : mode === "add" ? "Create" : "Update"}
        </Button>
      </div>
    </DialogContent>
  );
}
