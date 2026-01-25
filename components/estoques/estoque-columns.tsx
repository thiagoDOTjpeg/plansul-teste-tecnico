import { Estoque } from "@/hooks/use-estoques";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ArrowLeftRight, ArrowUpDown } from "lucide-react";
import { Button } from "../ui/button";

export function estoqueColumns({
  onMovimentar,
}: {
  onMovimentar: (e: Estoque) => void;
}): ColumnDef<Estoque>[] {
  return [
    { accessorKey: "produtos.sku", header: "SKU" },
    { accessorKey: "produtos.nome", header: "Nome" },
    {
      accessorKey: "quantidade",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Quantidade <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const qty = Number(row.getValue("quantidade"));
        const min = row.original.produtos?.estoque_minimo ?? 0;
        return (
          <span className={qty <= min ? "text-red-600 font-bold" : ""}>
            {qty}
          </span>
        );
      },
    },
    {
      accessorKey: "atualizado_em",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Atualizado em <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) =>
        format(new Date(row.getValue("atualizado_em")), "dd/MM/yyyy HH:mm"),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => onMovimentar(row.original)}
        >
          <ArrowLeftRight className="w-4 h-4 mr-2" /> Movimentar
        </Button>
      ),
    },
  ];
}
