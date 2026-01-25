"use client";

import { useCategories } from "@/hooks/use-categorias";
import { Estoque, useEstoques } from "@/hooks/use-estoques";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { DataTable } from "../custom/data-table";
import { AddEstoqueMovimentacaoModal } from "../estoque-movimentacoes/estoque-movimentacoes-add-modal";
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

  const { data: estoques, isLoading } = useEstoques({
    search,
    categoria_id: categoriaId,
  });
  const { data: categorias } = useCategories();
  const columns = estoqueColumns({
    onMovimentar: (estoque: Estoque) => setModalEstoque(estoque),
  });
  const [modalEstoque, setModalEstoque] = useState<Estoque | null>(null);

  const updateFilters = (key: string, value: string | boolean) => {
    const params = new URLSearchParams(searchParams.toString());
    if (!value || value === "all") {
      params.delete(key);
    } else {
      params.set(key, String(value));
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="space-y-4">
      <DataTable
        columns={columns}
        data={estoques?.data || []}
        isLoading={isLoading}
        searchComponent={
          <>
            <Input
              placeholder="Buscar por Nome ou SKU..."
              value={search}
              onChange={(e) => updateFilters("search", e.target.value)}
            />
            <Select
              value={categoriaId}
              onValueChange={(v) => updateFilters("categoria_id", v)}
            >
              <SelectTrigger className="w-50">
                <SelectValue placeholder="Categoria" />
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
          </>
        }
      />

      <AddEstoqueMovimentacaoModal
        isOpen={!!modalEstoque}
        estoque={modalEstoque}
        onClose={() => setModalEstoque(null)}
      />
    </div>
  );
}
