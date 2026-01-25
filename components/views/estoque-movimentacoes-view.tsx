"use client";

import { useEstoqueMovimentacoes } from "@/hooks/use-estoque-movimentacoes";
import { useEffect, useState } from "react";
import { DataTable } from "../custom/data-table";
import { estoqueMovimentacoesColumns } from "../estoque-movimentacoes/estoque-movimentacoes-columns";
import { Input } from "../ui/input";

export function EstoqueMovimentacoesView() {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [inputValue, setInputValue] = useState("");
  const [search, setSearch] = useState<string | undefined>(undefined);

  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(inputValue || undefined);
      setPage(1);
    }, 300);
    return () => clearTimeout(t);
  }, [inputValue]);

  const { data, isLoading, isError, error } = useEstoqueMovimentacoes({
    search,
    page,
    limit,
  });

  if (isError) {
    return (
      <div className="text-red-500">
        Error: {error?.message || "Failed to load stocks movements."}
      </div>
    );
  }

  const items = data?.data || [];

  return (
    <>
      <DataTable
        columns={estoqueMovimentacoesColumns}
        data={items}
        isLoading={isLoading}
        searchComponent={
          <Input
            placeholder="Buscar por SKU, Nome ou Marca..."
            className="max-w-sm"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
        }
        pageCount={data?.lastPage}
        currentPage={data?.page || page}
        onPageChange={(p: number) => setPage(p)}
      />
    </>
  );
}
