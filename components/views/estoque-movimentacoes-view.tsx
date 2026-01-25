"use-client";

import { useEstoqueMovimentacoes } from "@/hooks/use-estoque-movimentacoes";
import { DataTable } from "../custom/data-table";
import { estoqueMovimentacoesColumns } from "../estoque-movimentacoes/estoque-movimentacoes-columns";
import { Input } from "../ui/input";

export function EstoqueMovimentacoesView() {
  const {
    data: estoquesMovimentacoes,
    isLoading,
    isError,
    error,
  } = useEstoqueMovimentacoes();

  if (isError) {
    return (
      <div className="text-red-500">
        Error: {error?.message || "Failed to load stocks movements."}
      </div>
    );
  }

  return (
    <>
      <DataTable
        columns={estoqueMovimentacoesColumns}
        data={estoquesMovimentacoes || []}
        isLoading={isLoading}
        searchComponent={
          <Input
            placeholder="Buscar estoque movimentações..."
            className="max-w-sm"
          />
        }
      />
    </>
  );
}
