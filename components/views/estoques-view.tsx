"use-client";

import { Estoque, useEstoques } from "@/hooks/use-estoques";
import { useState } from "react";
import { DataTable } from "../custom/data-table";
import { AddEstoqueMovimentacaoModal } from "../estoque-movimentacoes/estoque-movimentacoes-add-modal";
import { AdjustStockModal } from "../estoques/estoque-adjust-modal";
import { estoqueColumns } from "../estoques/estoque-columns";
import { Input } from "../ui/input";

export function EstoquesView() {
  const { data: estoques, isLoading, isError, error } = useEstoques();
  const [selectedEstoque, setSelectedEstoque] = useState<Estoque | null>(null);
  const [modalEstoque, setModalEstoque] = useState<Estoque | null>(null);
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);

  const columns = estoqueColumns({
    onMovimentar: (estoque: Estoque) => setModalEstoque(estoque),
  });

  const handleEdit = (id: string) => {
    const estoqueToEdit = estoques?.find((est) => est.id === id);
    if (estoqueToEdit) {
      setSelectedEstoque(estoqueToEdit);
      setIsAdjustModalOpen(true);
    }
  };

  if (isError) {
    return (
      <div className="text-red-500">
        Error: {error?.message || "Failed to load estoques."}
      </div>
    );
  }

  return (
    <>
      <DataTable
        columns={columns}
        data={estoques || []}
        onEdit={handleEdit}
        isLoading={isLoading}
        editButtonText="Ajustar"
        searchComponent={
          <Input placeholder="Buscar estoques..." className="max-w-sm" />
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
    </>
  );
}
