"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { Search, Eye, Truck, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  useReactTable,
  SortingState,
  flexRender,
} from "@tanstack/react-table";
import TableBodyView from "@/components/ui/tableBodyView";
import TablePagination from "@/components/ui/tablePagination";

// Data type for Orders
type Orders = {
  id: string;
  date: string;
  buyer: string;
  amount: number;
  status: "Pending" | "Shipped" | "Delivered" | "Cancelled";
  item: string;
};

// Mock Data
const mockOrders: Orders[] = [
  {
    id: "Ord-01",
    date: "2025-05-15",
    buyer: "Mike Turner",
    amount: 200,
    status: "Pending",
    item: "Wireless Mouse",
  },
  {
    id: "Ord-02",
    date: "2025-05-14",
    buyer: "Mike Turner",
    amount: 100,
    status: "Shipped",
    item: "Bluetooth Keyboard",
  },
  {
    id: "Ord-03",
    date: "2025-05-14",
    buyer: "Mike Turner",
    amount: 300,
    status: "Delivered",
    item: '27" Monitor',
  },
  {
    id: "Ord-04",
    date: "2025-05-13",
    buyer: "Mike Turner",
    amount: 100,
    status: "Cancelled",
    item: "USB-C Hub",
  },
  {
    id: "Ord-05",
    date: "2025-05-15",
    buyer: "Mike Turner",
    amount: 500,
    status: "Delivered",
    item: "Laptop Stand",
  },
  {
    id: "Ord-06",
    date: "2025-05-15",
    buyer: "Mike Turner",
    amount: 50,
    status: "Delivered",
    item: "Webcam Cover",
  },
];

export function preprocessOrders(orders: Array<any>) {
  return orders.map((order) => {
    // Preprocess price to a formatted string (USD)
    const formattedPrice = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(Number(order.amount));

    return { ...order, formattedPrice };
  });
}

const initialData = preprocessOrders(mockOrders);

export default function App() {
  const [data, setData] = useState<Orders[]>(initialData);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const [shipModalOpen, setShipModalOpen] = useState(false);
  const [orderToShip, setOrderToShip] = useState<Orders | null>(null);

  const router = useRouter();

  const memoizedData = useMemo(() => data, [data]);

  // --- TanStack Table Column Definition ---
  const columns = useMemo<ColumnDef<Orders>[]>(
    () => [
      // ID Column
      {
        accessorKey: "id",
        header: "Order ID",
        enableSorting: true,
      },
      // Date Column
      {
        accessorKey: "date",
        header: "Date",
        enableSorting: true,
        enableGlobalFilter: false,
      },
      // Buyer Column
      {
        accessorKey: "buyer",
        header: "Buyer",
        enableSorting: true,
        cell: (info) => {
          const name = info.getValue() as string;
          return (
            <div className="min-w-[140px] text-ellipsis overflow-hidden">
              {name.length > 50 ? `${name.slice(0, 50)}...` : name}
            </div>
          );
        },
      },
      // Price Column
      {
        accessorKey: "formattedPrice",
        header: "Amount",
        enableSorting: true,
        enableGlobalFilter: false,
      },
      // Status Column
      {
        accessorKey: "status",
        header: "Status",
        cell: (info) => {
          const status = info.getValue() as string;
          if (status === "Cancelled") {
            return (
              <Badge className="bg-[#FCE9EC] text-destructive">Cancelled</Badge>
            );
          }
          if (status === "Pending") {
            return (
              <Badge className="bg-[#FEF3E6] text-[#C77414]">Pending</Badge>
            );
          }
          if (status === "Shipped") {
            return <Badge className="bg-[#EAEFFD] text-accent">Shipped</Badge>;
          }

          return <Badge className="bg-[#E9FAEF] text-success">Delivered</Badge>;
        },
        filterFn: "equals",
        enableGlobalFilter: false,
      },
      // Actions Column
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex w-full space-x-2">
            <Button
              className="flex-1 font-medium text-foreground-2 border border-border bg-transparent hover:bg-foreground/5"
              onClick={() => handleView(row.original.id)}
            >
              <Eye className="size-6" />
              <span className="inline-flex md:hidden xl:inline-flex">
                {" "}
                View
              </span>
            </Button>
            <Button
              className="flex-1 font-medium "
              onClick={() => handleShip(row.original)}
            >
              <Truck className="size-6" />
              <span className="inline-flex md:hidden xl:inline-flex">
                {" "}
                Ship
              </span>
            </Button>
          </div>
        ),
        enableSorting: false,
        enableGlobalFilter: false,
      },
    ],
    [] // runs once unless data structure changes
  );

  const table = useReactTable({
    data: memoizedData,
    columns,
    state: {
      sorting,
      globalFilter,
    },

    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getRowId: (row) => row.id,
  });

  // --- Action Handlers ---
  const handleView = (orderId: string) => {
    router.push(`/seller/orders/${orderId}`);
  };

  const handleShip = (order: Orders) => {
    setOrderToShip(order);
    setShipModalOpen(true);
  };

  return (
    <div>
      {/* Toolbar */}
      <div className="flex-1 flex items-center w-full h-[52px] bg-background text-foreground border border-border rounded-md">
        <Search className="size-6 ml-2.5" />
        <Input
          type="text"
          className="text-foreground-2 bg-background! border-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 h-[40px]!"
          placeholder="Search by order id or customer name"
          value={globalFilter ?? ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
        />
      </div>

      {/* Tab filter */}
      <div className="border border-border rounded-lg bg-[#F0F3F6] p-1.5 flex gap-1 mt-4">
        {["All", "Pending", "Shipped", "Delivered", "Cancelled"].map(
          (status) => (
            <Button
              key={status}
              variant={
                table.getColumn("status")?.getFilterValue() ===
                (status === "All" ? undefined : status)
                  ? "active"
                  : "ghost"
              }
              className="flex-1 px-4 py-2 text-sm md:text-lg font-normal"
              onClick={() => {
                table
                  .getColumn("status")
                  ?.setFilterValue(status === "All" ? undefined : status);
              }}
            >
              {status}
            </Button>
          )
        )}
      </div>

      <div className="section-break"></div>

      {/* Table */}
      <TableBodyView table={table} columns={columns} />
      {/* Table - Mobile view */}
      <div className="flex flex-col gap-2.5 md:hidden">
        {table.getRowModel().rows.length ? (
          table.getRowModel().rows.map((row) => (
            <div
              key={row.id}
              className="rounded-md border border-border bg-background p-2.5"
            >
              <div>
                <h6 className="font-medium text-foreground-2 truncate">
                  {row.getValue("id")}
                </h6>
                <p className="text-foreground-2">{row.getValue("date")}</p>
              </div>

              <hr className="bg-border my-2.5" />
              <div className="flex items-center gap-4 justify-between">
                <div className="min-w-[100px] font-medium text-sm">
                  <h6>Buyer</h6>
                  <p className="text-foreground-2">{row.getValue("buyer")}</p>
                </div>
                <div className="min-w-[100px] font-medium text-sm">
                  <h6>Amount</h6>
                  <p className="text-foreground-2">
                    {row.getValue("formattedPrice")}
                  </p>
                </div>
                <div className="min-w-[100px] text-center">
                  <h6 className="font-medium text-sm">Status</h6>
                  {/* Render status cell using the column's cell renderer */}
                  {(() => {
                    const statusCell = row
                      .getAllCells()
                      .find((cell) => cell.column.id === "status");
                    return statusCell
                      ? flexRender(
                          statusCell.column.columnDef.cell,
                          statusCell.getContext()
                        )
                      : null;
                  })()}
                </div>
              </div>
              <hr className="bg-border my-2.5" />
              <div className="flex items-center gap-4 justify-between">
                {/* Render actions cell if exists */}
                {(() => {
                  const actionsCell = row
                    .getAllCells()
                    .find((cell) => cell.column.id === "actions");
                  return actionsCell ? (
                    flexRender(
                      actionsCell.column.columnDef.cell,
                      actionsCell.getContext()
                    )
                  ) : (
                    <div>Actions</div>
                  );
                })()}
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-md border border-border bg-background p-2.5 text-center">
            No results.
          </div>
        )}
      </div>
      {/* Pagination */}
      <TablePagination table={table} globalFilter={globalFilter} />

      {/* Ship Modal */}
      {shipModalOpen && orderToShip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-background px-6 py-8 rounded-lg border border-border w-[90%] max-w-[430px]">
            <h3 className="text-foreground-2 font-semibold text-xl">
              Order #{orderToShip.id}
            </h3>
            <p className="text-foreground mb-6">Placed on {orderToShip.date}</p>

            <div className="flex items-center gap-2 justify-between w-full">
              <p>Status:</p>
              <Badge className="bg-[#EAEFFD] text-accent">
                {orderToShip.status}
              </Badge>
            </div>

            <hr className="bg-border my-4" />

            <div className="flex items-center gap-2 justify-between w-full mb-5">
              <p>Product:</p>
              {orderToShip.item}
            </div>
            <div className="flex items-center gap-2 justify-between w-full mb-5">
              <p>Amount:</p>
              {orderToShip.amount}
            </div>
            <div className="flex items-center gap-2 justify-between w-full mb-5">
              <p>Customer:</p>
              {orderToShip.buyer}
            </div>
            <div className="section-break"></div>
            <div className="flex gap-4 justify-center">
              <Button
                className="flex-1 font-medium text-foreground-2 border border-border bg-transparent hover:bg-foreground/5"
                onClick={() => setShipModalOpen(false)}
              >
                <X className="size-6 inline" /> Cancel
              </Button>
              <Button
                className="flex-1 font-medium"
                onClick={() => {
                  // TODO: Integrate with backend to mark as shipped
                  toast.success(`Order ${orderToShip.id} marked as shipped!`);
                  setShipModalOpen(false);
                  setOrderToShip(null);
                }}
              >
                <Truck className="size-6 inline" /> Ship Order
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
