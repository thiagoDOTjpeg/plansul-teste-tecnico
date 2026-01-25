"use client";

import { useEstoqueMovimentacoes } from "@/hooks/use-estoque-movimentacoes";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { DataTable } from "../custom/data-table";
import { estoqueMovimentacoesColumns } from "../estoque-movimentacoes/estoque-movimentacoes-columns";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export function EstoqueMovimentacoesView() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const search = searchParams.get("search") || "";
  const tipo = searchParams.get("tipo") || "all";
  const page = Number(searchParams.get("page")) || 1;
  const limit = 10;

  const tipoFilter = tipo === "all" ? undefined : (tipo as "entrada" | "saida");

  const { data, isLoading, isError, error } = useEstoqueMovimentacoes({
    search,
    tipo: tipoFilter,
    page,
    limit,
  });

  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (!value || value === "all") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    if (key !== "page") {
      params.delete("page");
    }

    router.push(`${pathname}?${params.toString()}`);
  };

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
            value={search}
            onChange={(e) => updateFilters("search", e.target.value)}
          />
        }
        filterComponent={
          <Select value={tipo} onValueChange={(v) => updateFilters("tipo", v)}>
            <SelectTrigger className="w-50">
              <SelectValue placeholder="Filtrar por Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Tipos</SelectItem>
              <SelectItem value="entrada">Entrada</SelectItem>
              <SelectItem value="saida">Saída</SelectItem>
            </SelectContent>
          </Select>
        }
        pageCount={data?.lastPage}
        currentPage={data?.page || page}
        onPageChange={(newPage: number) =>
          updateFilters("page", newPage.toString())
        }
      />
    </>
  );
}
