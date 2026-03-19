import { useState } from "react";
import { StoreLayout } from "@/components/common/layout";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

interface StoreItem {
  id: number;
  name: string;
  category: string;
  price: number;
  unit: string;
  isAvailable: boolean;
}

const storeItems: StoreItem[] = [
  {
    id: 1,
    name: "Fresh Chicken Breast",
    category: "Broiler Chicken",
    price: 280,
    unit: "kg",
    isAvailable: true,
  },
  {
    id: 2,
    name: "Whole Roast Chicken",
    category: "Broiler Chicken",
    price: 450,
    unit: "kg",
    isAvailable: true,
  },
  {
    id: 3,
    name: "Crispy Fried Chicken",
    category: "Broiler Chicken",
    price: 320,
    unit: "kg",
    isAvailable: true,
  },
  {
    id: 4,
    name: "Country Chicken - Whole",
    category: "Country Chicken",
    price: 550,
    unit: "kg",
    isAvailable: false,
  },
  {
    id: 5,
    name: "Country Chicken - Cut Pieces",
    category: "Country Chicken",
    price: 580,
    unit: "kg",
    isAvailable: true,
  },
  {
    id: 6,
    name: "Farm Fresh Eggs (12 pcs)",
    category: "Eggs",
    price: 84,
    unit: "pcs",
    isAvailable: true,
  },
  {
    id: 7,
    name: "Farm Fresh Eggs (30 pcs)",
    category: "Eggs",
    price: 195,
    unit: "pcs",
    isAvailable: true,
  },
  {
    id: 8,
    name: "Chicken Wings",
    category: "Broiler Chicken",
    price: 240,
    unit: "kg",
    isAvailable: true,
  },
];

export default function ItemAvailabilityPage() {
  const [items, setItems] = useState<StoreItem[]>(storeItems);

  const toggleAvailability = (id: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isAvailable: !item.isAvailable } : item,
      ),
    );
  };

  return (
    <StoreLayout title="Item Availability">
      <div className="space-y-6">
        <div>
          <h2 className="text-base font-medium text-foreground">
            Manage item availability for your store
          </h2>
          <p className="text-sm text-muted-foreground italic">
            Items marked as "Out of Stock" will be hidden from customers in the
            mobile app
          </p>
        </div>

        <div className="bg-card border border-border rounded-[10px] overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-border">
                <TableHead className="text-left py-3 pl-4 text-sm font-medium text-foreground">
                  Item Name
                </TableHead>
                <TableHead className="text-left py-3 pl-4 text-sm font-medium text-foreground">
                  Category
                </TableHead>
                <TableHead className="text-left py-3 pl-4 text-sm font-medium text-foreground">
                  Price
                </TableHead>
                <TableHead className="text-left py-3 pl-4 text-sm font-medium text-foreground">
                  Availability Status
                </TableHead>
                <TableHead className="text-right py-3 pr-4 text-sm font-medium text-foreground">
                  Toggle
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id} className="border-b border-border">
                  <TableCell className="py-3 pl-4">
                    <span className="text-sm font-medium text-foreground">
                      {item.name}
                    </span>
                  </TableCell>
                  <TableCell className="py-3 pl-4">
                    <span className="text-sm text-foreground">
                      {item.category}
                    </span>
                  </TableCell>
                  <TableCell className="py-3 pl-4">
                    <span className="text-sm text-foreground">
                      ₹{item.price.toFixed(2)}/{item.unit}
                    </span>
                  </TableCell>
                  <TableCell className="py-3 pl-4">
                    {item.isAvailable ? (
                      <span className="inline-flex items-center px-2 py-1 bg-[#dcfce7] rounded text-xs font-medium text-[#016630]">
                        Available
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 bg-[#ffe2e2] rounded text-xs font-medium text-[#9f0712]">
                        Out of Stock
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="py-3 pr-4">
                    <div className="flex items-center justify-end gap-3">
                      <span className="text-sm text-muted-foreground">
                        {item.isAvailable ? "Available" : "Out of Stock"}
                      </span>
                      <Switch
                        checked={item.isAvailable}
                        onCheckedChange={() => toggleAvailability(item.id)}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="bg-[#eff6ff] border border-[#bedbff] rounded-[10px] px-4 py-4">
          <p className="text-sm text-[#1c398e]">
            <span className="font-semibold">Note:</span>{" "}
            <span className="font-normal">
              When you mark an item as "Out of Stock", it will immediately
              disappear from the customer app for your store. The item will
              still be visible to Admin and can be made available again by
              toggling the switch.
            </span>
          </p>
        </div>
      </div>
    </StoreLayout>
  );
}
