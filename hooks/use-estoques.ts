import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as z from "zod";

export const updateEstoqueSchema = z.object({
  id: z.string(),
  quantidade: z.string().min(0, "Quantidade é obrigatória")
});

export interface EstoqueFilters {
  search?: string;
  categoria_id?: string;
  page?: number;
  limit?: number;
}

export type Estoque = {
  id: string;
  produto_id: string;
  quantidade: string;
  atualizado_em: string;
  produtos?: {
    id: string;
    sku: string;
    nome: string;
    marca: string | null;
    estoque_minimo: number;
    categorias?: {
      nome: string;
    };
  };
};

export type EstoqueResponse = {
  data: Estoque[];
  total: number;
  page: number;
  limit: number;
  lastPage: number;
};

export type UpdateEstoquePayload = z.infer<typeof updateEstoqueSchema>;

const fetchEstoques = async (filters: EstoqueFilters): Promise<EstoqueResponse> => {
  const params = new URLSearchParams();
  if (filters.search) params.append("search", filters.search);
  if (filters.categoria_id && filters.categoria_id !== "all") params.append("categoria_id", filters.categoria_id);
  if (filters.page) params.append("page", filters.page.toString());
  if (filters.limit) params.append("limit", filters.limit.toString());

  const response = await fetch(`/api/estoques?${params.toString()}`);
  if (!response.ok) {
    throw new Error("Falha ao buscar dados do estoque");
  }
  return response.json();
};

export function useEstoques(filters: EstoqueFilters = {}) {
  return useQuery({
    queryKey: ["estoques", filters],
    queryFn: () => fetchEstoques(filters),
  });
}

export const useUpdateEstoque = () => {
  const queryClient = useQueryClient();
  return useMutation<Estoque, Error, UpdateEstoquePayload>({
    mutationFn: async (payload) => {
      const response = await fetch(`/api/estoques/${payload.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error("Failed to update stock");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["estoques"] });
      queryClient.invalidateQueries({ queryKey: ["estoques-movimentacoes"] });
    }
  });
};