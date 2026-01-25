import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as z from "zod";

export const createEstoqueMovimentacaoSchema = z.object({
  produto_id: z.string(),
  quantidade: z.string(),
  tipo_movimentacao: z.enum(["entrada", "saida"])
});

export interface EstoqueMovimentacaoFilters {
  search?: string;
  tipo?: "entrada" | "saida";
  page?: number;
  limit?: number;
}

export type EstoqueMovimentacao = {
  id: string;
  quantidade: string;
  tipo: "entrada" | "saida";
  criado_em: string;
  produtos?: {
    id: string;
    sku: string;
    nome: string;
    marca: string | null;
  }
}

export type CreateEstoqueMovimentacaoPayload = z.infer<typeof createEstoqueMovimentacaoSchema>;

export type EstoqueMovimentacaoResponse = {
  data: EstoqueMovimentacao[];
  total: number;
  page: number;
  limit: number;
  lastPage: number;
}

const fetchEstoqueMovimentacoes = async (filters: EstoqueMovimentacaoFilters): Promise<EstoqueMovimentacaoResponse> => {
  const params = new URLSearchParams();
  if (filters?.search) params.append('search', filters.search);
  if (filters?.page) params.append('page', filters.page.toString());
  if (filters?.tipo) params.append('tipo', filters?.tipo);
  if (filters?.limit) params.append('limit', filters.limit.toString());

  const response = await fetch(`/api/estoque-movimentacoes?${params.toString()}`);
  if (!response.ok) {
    throw new Error("Failed to fetch stocks movements");
  }
  return response.json();
}

const createEstoqueMovimentacao = async (payload: CreateEstoqueMovimentacaoPayload): Promise<EstoqueMovimentacao> => {
  const response = await fetch("/api/estoque-movimentacoes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to create stock movement");
  }
  return response.json();
}

export const useEstoqueMovimentacoes = (filters: EstoqueMovimentacaoFilters) => {
  return useQuery<EstoqueMovimentacaoResponse, Error>({
    queryKey: ["estoque-movimentacoes", filters],
    queryFn: () => fetchEstoqueMovimentacoes(filters),
  })
}

export const useCreateEstoqueMovimentacao = () => {
  const queryClient = useQueryClient();
  return useMutation<EstoqueMovimentacao, Error, CreateEstoqueMovimentacaoPayload>({
    mutationFn: createEstoqueMovimentacao,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["estoque-movimentacoes"] })
      queryClient.invalidateQueries({ queryKey: ["estoques"] })
    }
  })
}