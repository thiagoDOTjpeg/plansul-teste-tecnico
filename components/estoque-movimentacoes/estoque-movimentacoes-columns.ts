import { EstoqueMovimentacao } from "@/hooks/use-estoque-movimentacoes";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

export const estoqueMovimentacoesColumns: ColumnDef<EstoqueMovimentacao>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "quantidade",
    header: "Quantidade",
  },
  {
    accessorKey: "tipo",
    header: "Tipo Movimentação",
    cell: ({ row }) => {
      const tipo = row.getValue("tipo") as string;
      return tipo.slice(0, 1).toUpperCase() + tipo.slice(1, tipo.length)
    }
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
    accessorKey: "criado_em",
    header: "Criado em",
    cell: ({ row }) => {
      const date = new Date(row.getValue("criado_em"));
      return format(date, "dd/MM/yyyy HH:mm");
    }
  },
]