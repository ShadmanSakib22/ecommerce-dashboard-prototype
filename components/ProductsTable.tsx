"use client";

import React, { useState, useMemo, useCallback, useTransition } from "react";
import Image from "next/image";
import { toast } from "react-hot-toast";
import {
  Search,
  Trash,
  SquarePen,
  ChevronDown,
  TriangleAlert,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import {
  ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  useReactTable,
  VisibilityState,
  SortingState,
  ColumnFiltersState,
  flexRender,
} from "@tanstack/react-table";
import TableBodyView from "@/components/ui/tableBodyView";
import TablePagination from "@/components/ui/tablePagination";

// Data type for products
type Product = {
  id: string;
  image: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  status: "Active" | "Low Stock" | "Out of Stock";
  category:
    | "Apparel"
    | "Accessories"
    | "Electronics"
    | "Home Goods"
    | "Health & Beauty";
};

// Mock Data
const rawProducts: Product[] = [
  {
    id: "1",
    image: "/file.svg",
    name: "Premium Cotton T-Shirt",
    sku: "TS-001",
    price: 100,
    stock: 200,
    status: "Active",
    category: "Apparel",
  },
  {
    id: "2",
    image: "/file.svg",
    name: "Leather Wallet",
    sku: "WL-002",
    price: 50,
    stock: 200,
    status: "Active",
    category: "Accessories",
  },
  {
    id: "3",
    image: "/file.svg",
    name: "Wireless Earbuds",
    sku: "EB-003",
    price: 70,
    stock: 12,
    status: "Low Stock",
    category: "Electronics",
  },
  {
    id: "4",
    image: "/file.svg",
    name: "Handcrafted Ceramic Mug",
    sku: "MG-004",
    price: 60,
    stock: 32,
    status: "Active",
    category: "Home Goods",
  },
  {
    id: "5",
    image: "/file.svg",
    name: "Organic Face Cream",
    sku: "OF-005",
    price: 200,
    stock: 0,
    status: "Out of Stock",
    category: "Health & Beauty",
  },
  {
    id: "6",
    image: "/file.svg",
    name: "Bamboo Cutting Board",
    sku: "CB-006",
    price: 20,
    stock: 5,
    status: "Low Stock",
    category: "Home Goods",
  },
  {
    id: "7",
    image: "/file.svg",
    name: "Ergonomic Desk Chair",
    sku: "DC-007",
    price: 350,
    stock: 15,
    status: "Active",
    category: "Home Goods",
  },
  {
    id: "8",
    image: "/file.svg",
    name: "Smart Home Speaker",
    sku: "SH-008",
    price: 120,
    stock: 8,
    status: "Low Stock",
    category: "Electronics",
  },
  {
    id: "9",
    image: "/file.svg",
    name: "Stainless Steel Water Bottle",
    sku: "WB-009",
    price: 25,
    stock: 50,
    status: "Active",
    category: "Accessories",
  },
  {
    id: "10",
    image: "/file.svg",
    name: "Noise-Cancelling Headphones",
    sku: "NC-010",
    price: 180,
    stock: 0,
    status: "Out of Stock",
    category: "Electronics",
  },
  {
    id: "11",
    image: "/file.svg",
    name: "High-Performance Laptop",
    sku: "HP-011",
    price: 1500,
    stock: 10,
    status: "Active",
    category: "Electronics",
  },
];

export function preprocessProducts(products: Array<any>) {
  return products.map((product) => {
    let status = "Active";
    if (product.stock === 0) status = "Out of Stock";
    else if (product.stock < 10) status = "Low Stock";

    // Preprocess price to a formatted string (USD)
    const formattedPrice = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(Number(product.price));

    return { ...product, status, formattedPrice };
  });
}

const initialProducts = preprocessProducts(rawProducts);

// Mock function for async deletion of products
const deleteProducts = async (ids: string[]) => {
  console.log("Simulating deletion of products:", ids);
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1000));
  if (Math.random() > 0.1) {
    // 90% success rate for simulation
    return {
      success: true,
      message: `Successfully deleted ${ids.length} product(s).`,
    };
  } else {
    throw new Error("Failed to delete products. Please try again.");
  }
};

export default function App() {
  const [data, setData] = useState<Product[]>(initialProducts);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [rowSelection, setRowSelection] = useState({});
  const [isPending, startTransition] = useTransition();

  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [productsToUpdate, setProductsToUpdate] = useState<Product[]>([]);
  const [bulkStock, setBulkStock] = useState<number | "">("");
  const [bulkPrice, setBulkPrice] = useState<number | "">("");

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const memoizedData = useMemo(() => data, [data]);

  // --- TanStack Table Column Definition ---
  const columns = useMemo<ColumnDef<Product>[]>(
    () => [
      // Checkbox Column
      {
        id: "select",
        header: ({ table }) => (
          <div className="flex items-center justify-center size-4 mr-3">
            <Checkbox
              checked={
                table.getIsAllPageRowsSelected() ||
                (table.getIsSomePageRowsSelected() && "indeterminate")
              }
              onCheckedChange={(value) =>
                table.toggleAllPageRowsSelected(!!value)
              }
              aria-label="Select all"
            />
          </div>
        ),
        cell: ({ row }) => (
          <div className="flex items-center justify-center size-4">
            <Checkbox
              checked={row.getIsSelected()}
              onCheckedChange={(value) => row.toggleSelected(!!value)}
              aria-label="Select row"
            />
          </div>
        ),
        enableSorting: false,
        enableHiding: false,
      },
      // Image Column
      {
        accessorKey: "image",
        header: "Image",
        cell: (info) => {
          const imageUrl = info.getValue() as string;
          return (
            <div className="flex flex-col items-center justify-center w-[46px] h-[46px] bg-gray-200 rounded-md">
              <Image
                src={imageUrl}
                alt=""
                width={46}
                height={46}
                className="object-cover w-[42px] h-[42px] p-1 rounded-md border-none"
              />
            </div>
          );
        },
        enableSorting: false,
        enableGlobalFilter: false,
      },
      // Name Column
      {
        accessorKey: "name",
        header: "Name",
        enableSorting: true,
        cell: (info) => {
          const name = info.getValue() as string;
          return (
            <div className="min-w-[200px] text-ellipsis overflow-hidden">
              {name.length > 50 ? `${name.slice(0, 50)}...` : name}
            </div>
          );
        },
      },
      // SKU Column
      {
        accessorKey: "sku",
        header: "SKU",
        enableSorting: true,
      },
      // Price Column
      {
        accessorKey: "formattedPrice",
        header: "Price",
        enableSorting: true,
        enableGlobalFilter: false,
      },
      // Stock Column
      {
        accessorKey: "stock",
        header: "Stock",
        enableSorting: true,
        enableGlobalFilter: false,
      },
      // Status Column
      {
        accessorKey: "status",
        header: "Status",
        cell: (info) => {
          const status = info.getValue() as string;
          if (status === "Out of Stock") {
            return (
              <Badge className="bg-[#FCE9EC] text-destructive">
                Out of Stock
              </Badge>
            );
          }
          if (status === "Low Stock") {
            return (
              <Badge className="bg-[#FEF3E6] text-[#C77414]">Low Stock</Badge>
            );
          }
          return <Badge className="bg-[#E9FAEF] text-success">Active</Badge>;
        },
        filterFn: "equals",
        enableGlobalFilter: false,
      },
      // Category Column
      {
        accessorKey: "category",
        header: "Category",
        cell: (info) => info.getValue(),
        filterFn: "equals",
        enableHiding: true,
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
              onClick={() => handleEdit(row.original.id)}
            >
              <SquarePen className="size-6" />
              <span className="inline-flex md:hidden xl:inline-flex">
                {" "}
                Edit
              </span>
            </Button>
            <Button
              className="flex-1 font-medium text-destructive border border-[#F9D2D9] bg-transparent hover:bg-destructive/5"
              onClick={() => {
                setProductToDelete(row.original);
                setDeleteModalOpen(true);
              }}
            >
              <Trash className="size-6" />
              <span className="inline-flex md:hidden xl:inline-flex">
                {" "}
                Delete
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
      columnVisibility,
      columnFilters,
      globalFilter,
      rowSelection,
    },

    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    enableRowSelection: true,
    getRowId: (row) => row.id,
  });

  // --- Action Handlers ---
  const getSelectedIds = useCallback(() => {
    return table.getSelectedRowModel().rows.map((row) => row.original.id);
  }, [table]);

  const executeAction = useCallback(
    async (
      actionFn: (ids: string[]) => Promise<any>,
      ids: string[],
      messages: { loading: string; success: string; error: string }
    ) => {
      if (ids.length === 0) {
        toast.error("No items selected for this action.");
        return;
      }

      startTransition(() => {
        toast.promise(actionFn(ids), {
          loading: messages.loading,
          success: (result) => {
            if (result.success) {
              setData((prevData) =>
                prevData.filter((item) => !ids.includes(item.id))
              );
              table.resetRowSelection(); // Clear selection on success
              return messages.success;
            } else {
              throw new Error(result.error || "An unknown error occurred.");
            }
          },
          error: (err) => `${messages.error}: ${err.message}`,
        });
      });
    },
    [table]
  );

  const handleEdit = useCallback((id: string) => {
    console.log(`Editing product with ID: ${id}`);
    toast.success("Editing product(s)");
  }, []);

  const handleDelete = useCallback(
    (ids: string[]) => {
      executeAction(deleteProducts, ids, {
        loading: "Deleting products...",
        success: "Products deleted successfully!",
        error: "Failed to delete products",
      });
    },
    [executeAction]
  );

  const handleBulkDelete = useCallback(() => {
    const selectedIds = getSelectedIds();
    handleDelete(selectedIds);
  }, [getSelectedIds, handleDelete]);

  const handleCategoryFilterChange = (value: string) => {
    if (value === "All") {
      table.getColumn("category")?.setFilterValue(undefined);
      return;
    } else table.getColumn("category")?.setFilterValue(value);
  };

  const handleStatusFilterChange = (value: string) => {
    if (value === "All") {
      table.getColumn("status")?.setFilterValue(undefined);
      return;
    } else table.getColumn("status")?.setFilterValue(value);
  };

  // Derived state for convenience (for display purposes)
  const selectedRowCount = table.getFilteredSelectedRowModel().rows.length;

  return (
    <div>
      {/* Toolbar */}
      <div className="flex flex-wrap justify-between items-center gap-x-5 gap-y-2.5">
        <div className="flex-1 flex items-center w-full h-[52px] bg-background text-foreground border border-border rounded-md">
          <Search className="size-6 ml-2.5" />
          <Input
            type="text"
            className="text-foreground-2 bg-background! border-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
            placeholder="Search by name or SKU..."
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
          />
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-x-5 gap-y-2.5 w-full lg:w-auto ">
          {/* Category Filter */}
          <Select onValueChange={handleCategoryFilterChange}>
            <SelectTrigger className="w-full md:w-1/2 lg:w-auto min-w-[204px] h-[52px]! bg-background! text-foreground-2! cursor-pointer border-border rounded-md shadow-none">
              <div>
                {(table.getColumn("category")?.getFilterValue() as string) ||
                  "Category"}
              </div>
            </SelectTrigger>
            <SelectContent className="bg-background text-sm border-foreground">
              <SelectItem value="All">All Categories</SelectItem>
              <SelectItem value="Apparel">Apparel</SelectItem>
              <SelectItem value="Accessories">Accessories</SelectItem>
              <SelectItem value="Electronics">Electronics</SelectItem>
              <SelectItem value="Home Goods">Home Goods</SelectItem>
              <SelectItem value="Health & Beauty">Health & Beauty</SelectItem>
            </SelectContent>
          </Select>

          {/* Stock Status Filter */}
          <Select onValueChange={handleStatusFilterChange}>
            <SelectTrigger className="w-full md:w-1/2 lg:w-auto min-w-[204px] h-[52px]! bg-background! text-foreground-2! cursor-pointer border-border rounded-md shadow-none">
              <div>
                {(table.getColumn("status")?.getFilterValue() as string) ||
                  "Stock Status"}
              </div>
            </SelectTrigger>
            <SelectContent className="bg-background text-sm border-foreground">
              <SelectItem value="All">All</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Low Stock">Low Stock</SelectItem>
              <SelectItem value="Out of Stock">Out of Stock</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Bulk Actions & Column Visibility */}
      <div className="mt-5 hidden md:flex space-x-2">
        <Button
          onClick={() => {
            setProductsToUpdate(
              table
                .getFilteredSelectedRowModel()
                .rows.map((row) => row.original)
            );
            setUpdateModalOpen(true);
          }}
          className="font-medium text-foreground-2 border border-border bg-background hover:bg-foreground/5"
          disabled={selectedRowCount === 0 || isPending}
        >
          <SquarePen className="size-6" /> Update ({selectedRowCount})
        </Button>
        <Button
          className="font-medium text-destructive border border-[#F9D2D9] bg-background hover:bg-destructive/5"
          onClick={handleBulkDelete}
          disabled={selectedRowCount === 0 || isPending}
        >
          <Trash className="size-6" /> Delete ({selectedRowCount})
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="bg-background text-foreground-2 border border-border hover:bg-foreground/5 ml-auto">
              Columns <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
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
              <div className="flex gap-[26px] h-[46px] items-center">
                {/* Render image cell */}
                <div className="w-[46px] h-[46px] bg-gray-200 rounded-md">
                  <Image
                    src={row.getValue("image") as string}
                    alt={row.getValue("name") as string}
                    width={46}
                    height={46}
                    className="object-cover w-[46px] h-[46px] p-[2px] rounded-md border-none"
                  />
                </div>
                <div>
                  <h6 className="font-medium text-foreground-2 truncate">
                    {row.getValue("name")}
                  </h6>
                  <p className="text-foreground-2">{row.getValue("sku")}</p>
                </div>
              </div>
              <hr className="bg-border my-2.5" />
              <div className="flex items-center gap-4 justify-between">
                <div className="min-w-[100px] font-medium text-sm">
                  <h6>Price</h6>
                  <p className="text-foreground-2">
                    {row.getValue("formattedPrice")}
                  </p>
                </div>
                <div className="min-w-[100px] font-medium text-sm">
                  <h6>Stock</h6>
                  <p className="text-foreground-2">{row.getValue("stock")}</p>
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

      {/* Delete Product Modal */}
      {deleteModalOpen && productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-background px-6 py-8 rounded-lg border border-border inline-flex flex-col items-center justify-center gap-5 w-[90%] max-w-[430px] mx-auto text-center">
            <div className="inline-block p-4 rounded-full bg-secondary text-secondary-foreground ">
              <TriangleAlert className="size-8 " />
            </div>
            <h3 className="text-foreground-2 font-medium text-2xl">
              Delete Product?
            </h3>
            <p>
              Are you sure you want to delete this product? This action cannot
              be undone.
            </p>
            <p className="text-foreground-2 font-medium text-xl">
              {productToDelete.name}
            </p>
            <div className="flex justify-center items-center gap-5">
              <Button
                className="font-medium text-foreground-2 border border-border bg-transparent hover:bg-foreground/5"
                onClick={() => setDeleteModalOpen(false)}
              >
                <X className="size-6" />
                <span className="inline-flex md:hidden xl:inline-flex">
                  {" "}
                  Cancel
                </span>
              </Button>
              <Button
                className="font-medium "
                onClick={async () => {
                  await handleDelete([productToDelete.id]);
                  setDeleteModalOpen(false);
                  setProductToDelete(null);
                }}
              >
                <Trash className="size-6" />
                <span className="inline-flex md:hidden xl:inline-flex">
                  {" "}
                  Delete
                </span>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Update Modal */}
      {updateModalOpen && productsToUpdate.length > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-background px-6 py-8 rounded-lg border border-border inline-flex flex-col items-center justify-center gap-5 w-4/5 max-w-[430px] mx-auto text-center">
            <h3 className="text-foreground-2 font-medium text-2xl">
              Bulk Update Products
            </h3>
            <p>
              Update{" "}
              <span className="font-semibold">{productsToUpdate.length}</span>{" "}
              product{productsToUpdate.length > 1 ? "s" : ""}.
            </p>
            <form
              className="flex flex-col gap-4 w-full"
              onSubmit={(e) => {
                e.preventDefault();
                // TODO: Integrate with DB/API
                // Dummy function for now
                console.log("Bulk update", {
                  bulkStock,
                  bulkPrice,
                  productsToUpdate,
                });
                setUpdateModalOpen(false);
                setBulkStock("");
                setBulkPrice("");
              }}
            >
              <div className="flex flex-col gap-2">
                <label htmlFor="bulk-stock" className="text-left font-medium">
                  Stock
                </label>
                <input
                  id="bulk-stock"
                  type="number"
                  min={0}
                  value={bulkStock}
                  onChange={(e) =>
                    setBulkStock(
                      e.target.value === "" ? "" : Number(e.target.value)
                    )
                  }
                  className="border rounded px-3 py-2"
                  placeholder="Leave blank to keep unchanged"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="bulk-price" className="text-left font-medium">
                  Price
                </label>
                <input
                  id="bulk-price"
                  type="number"
                  min={0}
                  value={bulkPrice}
                  onChange={(e) =>
                    setBulkPrice(
                      e.target.value === "" ? "" : Number(e.target.value)
                    )
                  }
                  className="border rounded px-3 py-2"
                  placeholder="Leave blank to keep unchanged"
                />
              </div>
              <div className="flex gap-4 justify-center mt-2">
                <Button
                  type="button"
                  className="font-medium text-foreground-2 border border-border bg-transparent hover:bg-foreground/5"
                  onClick={() => setUpdateModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" className="font-medium">
                  Update
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
