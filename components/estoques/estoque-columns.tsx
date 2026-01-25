import { Estoque } from "@/hooks/use-estoques";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ArrowLeftRight } from "lucide-react";
import { Button } from "../ui/button";

type EstoqueColumnsProps = {
  onMovimentar: (estoque: Estoque) => void;
};

export function estoqueColumns({
  onMovimentar,
}: EstoqueColumnsProps): ColumnDef<Estoque>[] {
  return [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "produtos.sku",
      header: "SKU",
    },
    {
      accessorKey: "produtos.nome",
      header: "Nome",
    },
    {
      accessorKey: "produtos.marca",
      header: "Marca",
    },
    {
      accessorKey: "quantidade",
      header: "Quantidade",
      cell: ({ row }) => {
        const quantidade = Number(row.getValue("quantidade"));
        const estoqueMinimo = row.original.produtos?.estoque_minimo ?? 0;
        const isBelowMin = quantidade < estoqueMinimo;
        return (
          <span className={isBelowMin ? "text-red-600 font-bold" : undefined}>
            {quantidade}
          </span>
        );
      },
    },
    {
      accessorKey: "atualizado_em",
      header: "Atualizado em",
      cell: ({ row }) => {
        const date = new Date(row.getValue("atualizado_em"));
        return format(date, "dd/MM/yyyy HH:mm");
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const estoque = row.original;
        return (
          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onMovimentar(estoque)}
            >
              <ArrowLeftRight className="w-4 h-4 mr-2" /> Movimentar
            </Button>
          </div>
        );
      },
    },
  ];
}
