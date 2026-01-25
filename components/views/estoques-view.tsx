"use client";

import { useCategories } from "@/hooks/use-categorias";
import { Estoque, useEstoques } from "@/hooks/use-estoques";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { DataTable } from "../custom/data-table";
import { AddEstoqueMovimentacaoModal } from "../estoque-movimentacoes/estoque-movimentacoes-add-modal";
import { AdjustStockModal } from "../estoques/estoque-adjust-modal";
import { estoqueColumns } from "../estoques/estoque-columns";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export function EstoquesView() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const search = searchParams.get("search") || "";
  const categoriaId = searchParams.get("categoria_id") || "all";
  const page = Number(searchParams.get("page")) || 1;
  const limit = 10;

  const {
    data: estoques,
    isLoading,
    isError,
    error,
  } = useEstoques({
    search,
    categoria_id: categoriaId,
    page,
    limit,
  });

  const { data: categorias } = useCategories();

  const [modalEstoque, setModalEstoque] = useState<Estoque | null>(null);
  const [selectedEstoque, setSelectedEstoque] = useState<Estoque | null>(null);
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);

  const columns = estoqueColumns({
    onMovimentar: (estoque: Estoque) => setModalEstoque(estoque),
  });

  const handleEdit = (id: string) => {
    const estoqueToEdit = estoques?.data?.find((est) => est.id === id);
    if (estoqueToEdit) {
      setSelectedEstoque(estoqueToEdit);
      setIsAdjustModalOpen(true);
    }
  };

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
      <div className="text-red-500 p-4 border rounded bg-red-50">
        Erro ao carregar estoque: {error?.message || "Erro desconhecido."}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <DataTable
        columns={columns}
        data={estoques?.data || []}
        isLoading={isLoading}
        onEdit={handleEdit}
        editButtonText="Ajustar"
        pageCount={estoques?.lastPage}
        currentPage={page}
        onPageChange={(newPage) => updateFilters("page", newPage.toString())}
        searchComponent={
          <Input
            placeholder="Buscar por Nome ou SKU..."
            value={search}
            onChange={(e) => updateFilters("search", e.target.value)}
            className="max-w-sm"
          />
        }
        filterComponent={
          <Select
            value={categoriaId}
            onValueChange={(v) => updateFilters("categoria_id", v)}
          >
            <SelectTrigger className="w-50">
              <SelectValue placeholder="Filtrar por Categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as Categorias</SelectItem>
              {categorias?.map((c) => (
                <SelectItem key={c.id} value={c.id.toString()}>
                  {c.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        }
      />

      <AddEstoqueMovimentacaoModal
        isOpen={!!modalEstoque}
        estoque={modalEstoque}
        onClose={() => setModalEstoque(null)}
      />

      <AdjustStockModal
        isOpen={isAdjustModalOpen}
        onClose={() => setIsAdjustModalOpen(false)}
        estoque={selectedEstoque}
      />
    </div>
  );
}
