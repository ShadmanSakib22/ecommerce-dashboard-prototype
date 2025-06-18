"use client";

import React from "react";
import { Table as TanstackTableType } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TablePaginationControlsProps {
  table: TanstackTableType<any>;
  globalFilter: string;
}

const TablePaginationControls: React.FC<TablePaginationControlsProps> = ({
  table,
  globalFilter,
}) => {
  // Get pagination state from table instance
  const { pageIndex, pageSize } = table.getState().pagination;
  const pageCount = table.getPageCount();

  const currentPage = pageIndex + 1;
  const currentRowsPerPage = pageSize;

  return (
    <div className="flex flex-wrap bg-background border border-border justify-between gap-4 mt-4 p-4 rounded-md">
      {/* Rows Per Page Selector */}
      <div className="text-center">
        <Select
          value={currentRowsPerPage.toString()}
          onValueChange={(value) => {
            table.setPageSize(Number(value));
          }}
        >
          <SelectTrigger className="w-[80px] h-9 bg-background! border border-border">
            <SelectValue placeholder={currentRowsPerPage} />
          </SelectTrigger>
          <SelectContent>
            {[5, 10, 15, 20, 50].map((size) => (
              <SelectItem key={size} value={size.toString()}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="font-roboto text-xs text-nowrap text-foreground-2">
          Rows Per Page
        </span>
      </div>

      {/* Pagination Info and Controls */}
      <div className="text-center ">
        <div className="flex rounded-md">
          <Button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="rounded-r-none"
          >
            «
          </Button>
          {/* Page number input */}
          <Input
            type="number"
            value={currentPage}
            onChange={(e) =>
              table.setPageIndex(Math.max(0, Number(e.target.value) - 1))
            }
            className="w-[80px] text-center rounded-none px-2 py-1 h-9"
          />
          <Button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="rounded-l-none"
          >
            »
          </Button>
        </div>
        <span className="text-xs font-roboto text-nowrap text-foreground-2">
          Page {currentPage} of {pageCount}
          {globalFilter ? " matching filter" : ""}
        </span>
      </div>
    </div>
  );
};

export default TablePaginationControls;
