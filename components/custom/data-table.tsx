"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface DataTableProps<TData extends { id: string }, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  isLoading?: boolean;
  filterComponent?: React.ReactNode;
  searchComponent?: React.ReactNode;
  actionButtons?: React.ReactNode[];
  editButtonText?: string;
  deleteButtonText?: string;

  // Props para Paginação Manual
  pageCount?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
}

export function DataTable<TData extends { id: string }, TValue>({
  columns,
  data,
  onEdit,
  onDelete,
  isLoading = false,
  filterComponent,
  searchComponent,
  actionButtons,
  editButtonText,
  deleteButtonText,
  pageCount,
  currentPage = 1,
  onPageChange,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    pageCount: pageCount,
    manualPagination: true,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const generateSkeletonRow = (columnCount: number, key: number) => (
    <TableRow key={key}>
      {Array.from({ length: columnCount }).map((_, colIndex) => (
        <TableCell key={colIndex}>
          <Skeleton className="h-6 w-full" />
        </TableCell>
      ))}
    </TableRow>
  );

  return (
    <div>
      <div className="flex items-center py-4 gap-2">
        {searchComponent}
        {filterComponent}
        <div className="ml-auto flex gap-2">
          {actionButtons?.map((button, index) => (
            <React.Fragment key={index}>{button}</React.Fragment>
          ))}
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, index) =>
                generateSkeletonRow(
                  columns.length + (onEdit || onDelete ? 1 : 0),
                  index,
                ),
              )
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                  {(onEdit || onDelete) && (
                    <TableCell className="text-right">
                      {onEdit && (
                        <Button
                          variant="ghost"
                          onClick={() => onEdit(row.original.id)}
                          className="mr-2"
                        >
                          {editButtonText || "Edit"}
                        </Button>
                      )}
                      {onDelete && (
                        <Button
                          variant="ghost"
                          onClick={() => onDelete(row.original.id)}
                        >
                          {deleteButtonText || "Delete"}
                        </Button>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (onEdit || onDelete ? 1 : 0)}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="text-sm text-muted-foreground mr-4">
          Página {currentPage} de {pageCount || 1}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange?.(currentPage - 1)}
          disabled={currentPage <= 1 || isLoading}
        >
          Anterior
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange?.(currentPage + 1)}
          disabled={currentPage >= (pageCount || 1) || isLoading}
        >
          Próximo
        </Button>
      </div>
    </div>
  );
}
