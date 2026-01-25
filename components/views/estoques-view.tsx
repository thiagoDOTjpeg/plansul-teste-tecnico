"use-client";

import { Estoque, useEstoques } from "@/hooks/use-estoques";
import { useState } from "react";
import { DataTable } from "../custom/data-table";
import { AdjustStockModal } from "../estoques/estoque-adjust-modal";
import { estoqueColumns } from "../estoques/estoque-columns";
import { Input } from "../ui/input";

export function EstoquesView() {
  const { data: estoques, isLoading, isError, error } = useEstoques();
  const [selectedEstoque, setSelectedEstoque] = useState<Estoque | null>(null);
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
      />

      <AdjustStockModal
        isOpen={isAdjustModalOpen}
        onClose={() => setIsAdjustModalOpen(false)}
        estoque={selectedEstoque}
      />
    </>
  );
}
