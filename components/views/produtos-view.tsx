"use client";

import { DataTable } from "@/components/custom/data-table";
import { AddProductModal } from "@/components/produtos/produto-add-modal";
import { produtoColumns } from "@/components/produtos/produto-columns";
import { DeleteProductDialog } from "@/components/produtos/produto-delete-dialog";
import { EditProductModal } from "@/components/produtos/produto-edit-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCategories } from "@/hooks/use-categorias";
import { Produto, useProdutos } from "@/hooks/use-produtos";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export function ProdutosView() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const search = searchParams.get("search") || "";
  const categoriaId = searchParams.get("categoria_id") || "all";
  const page = Number(searchParams.get("page")) || 1;
  const limit = 10;

  const {
    data: produtos,
    isLoading,
    isError,
    error,
  } = useProdutos({ search, categoria_id: categoriaId, limit, page });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Produto | null>(null);
  const [productIdToDelete, setProductIdToDelete] = useState<string | null>(
    null,
  );

  const { data: categorias } = useCategories();

  const handleEdit = (id: string) => {
    const productToEdit = produtos?.data?.find((prod) => prod.id === id);
    if (productToEdit) {
      setSelectedProduct(productToEdit);
      setIsEditModalOpen(true);
    }
  };

  const handleDelete = (id: string) => {
    setProductIdToDelete(id);
    setIsDeleteModalOpen(true);
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
      <div className="text-red-500">
        Error: {error?.message || "Failed to load products."}
      </div>
    );
  }

  return (
    <>
      <DataTable
        columns={produtoColumns}
        data={produtos?.data || []}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isLoading={isLoading}
        pageCount={produtos?.lastPage}
        currentPage={page}
        onPageChange={(newPage) => updateFilters("page", newPage.toString())}
        searchComponent={
          <Input
            placeholder="Buscar por Nome, SKU ou Marca..."
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
        actionButtons={[
          <Button key="new-product" onClick={() => setIsAddModalOpen(true)}>
            Novo Produto
          </Button>,
        ]}
      />

      <AddProductModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
      <EditProductModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        product={selectedProduct}
      />
      <DeleteProductDialog
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        productId={productIdToDelete}
      />
    </>
  );
}
