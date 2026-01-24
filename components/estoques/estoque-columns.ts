import { Estoque } from "@/hooks/use-estoques";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

export const estoqueColumns: ColumnDef<Estoque>[] = [
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
  },
  {
    accessorKey: "atualizado_em",
    header: "Atualizado em",
    cell: ({ row }) => {
      const date = new Date(row.getValue("atualizado_em"));
      return format(date, "dd/MM/yyyy HH:mm");
    }
  },

]