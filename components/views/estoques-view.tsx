"use-client";

import { Estoque, useEstoques } from "@/hooks/use-estoques";
import { useState } from "react";
import { DataTable } from "../custom/data-table";
import { AddEstoqueMovimentacaoModal } from "../estoque-movimentacoes/estoque-movimentacoes-add-modal";
import { AdjustStockModal } from "../estoques/estoque-adjust-modal";
import { estoqueColumns } from "../estoques/estoque-columns";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export function EstoquesView() {
  const { data: estoques, isLoading, isError, error } = useEstoques();
  const [selectedEstoque, setSelectedEstoque] = useState<Estoque | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);

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
        columns={estoqueColumns}
        data={estoques || []}
        onEdit={handleEdit}
        isLoading={isLoading}
        editButtonText="Ajustar"
        searchComponent={
          <Input placeholder="Buscar estoques..." className="max-w-sm" />
        }
        actionButtons={[
          <Button key="new-movement" onClick={() => setIsAddModalOpen(true)}>
            Nova Movimentação
          </Button>,
        ]}
      />

      <AddEstoqueMovimentacaoModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      <AdjustStockModal
        isOpen={isAdjustModalOpen}
        onClose={() => setIsAdjustModalOpen(false)}
        estoque={selectedEstoque}
      />
    </>
  );
}
