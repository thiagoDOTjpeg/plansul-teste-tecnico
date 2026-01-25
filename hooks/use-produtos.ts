import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as z from "zod";

// Zod Schemas
export const createProdutoSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  sku: z.string().min(1, "SKU é obrigatório"),
  categoria_id: z.string().optional(),
  estoque_minimo: z.coerce.number().int().min(0, "Estoque mínimo não pode ser negativo").optional(),
  marca: z.string().optional(),
});

export const updateProdutoSchema = z.object({
  id: z.string(),
  nome: z.string().min(1, "Nome é obrigatório").optional(),
  sku: z.string().min(1, "SKU é obrigatório").optional(),
  categoria_id: z.string().optional(),
  estoque_minimo: z.coerce.number().int().min(0, "Estoque mínimo não pode ser negativo").optional(),
  marca: z.string().optional(),
});

export interface ProdutosFilters {
  search?: string;
  categoria_id?: string;
  page?: number;
  limit?: number;
}

// Types
export type Produto = {
  id: string; // Prisma BigInt is serialized as string
  categoria_id: string | null;
  sku: string;
  nome: string;
  estoque_minimo: number | null;
  marca: string | null;
  criado_em: string;
  categorias?: {
    id: string;
    nome: string;
  } | null;
  estoque?: {
    quantidade: number;
  } | null;
};

export type ProdutosResponse = {
  data: Produto[];
  total: number;
  page: number;
  limit: number;
  lastPage: number;
};

export type CreateProdutoPayload = z.infer<typeof createProdutoSchema>;
export type UpdateProdutoPayload = z.infer<typeof updateProdutoSchema>;

// API Functions
const fetchProdutos = async (filters: ProdutosFilters): Promise<ProdutosResponse> => {
  const params = new URLSearchParams();
  if (filters.search) params.append("search", filters.search);
  if (filters.categoria_id && filters.categoria_id !== "all") params.append("categoria_id", filters.categoria_id);
  if (filters.page) params.append("page", filters.page.toString());
  if (filters.limit) params.append("limit", filters.limit.toString());

  const response = await fetch(`/api/produtos?${params.toString()}`);
  if (!response.ok) {
    throw new Error("Falha ao buscar dados do estoque");
  }
  return response.json();
};

const fetchProdutoById = async (id: string): Promise<Produto> => {
  const response = await fetch(`/api/produtos/${id}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch product with ID ${id}`);
  }
  return response.json();
};

const createProduto = async (
  payload: CreateProdutoPayload
): Promise<Produto> => {
  const response = await fetch("/api/produtos", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to create product");
  }
  return response.json();
};

const updateProduto = async (
  payload: UpdateProdutoPayload
): Promise<Produto> => {
  const response = await fetch(`/api/produtos/${payload.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to update product");
  }
  return response.json();
};

const deleteProduto = async (id: string): Promise<void> => {
  const response = await fetch(`/api/produtos/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to delete product");
  }
};

// React Query Hooks
export const useProdutos = (filters: ProdutosFilters) => {
  return useQuery<ProdutosResponse, Error>({
    queryKey: ["produtos", filters],
    queryFn: () => fetchProdutos(filters),
  });
};

export const useProduto = (id: string) => {
  return useQuery<Produto, Error>({
    queryKey: ["produtos", id],
    queryFn: () => fetchProdutoById(id),
    enabled: !!id,
  });
};

export const useCreateProduto = () => {
  const queryClient = useQueryClient();
  return useMutation<Produto, Error, CreateProdutoPayload>({
    mutationFn: createProduto,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["produtos"] });
    },
  });
};

export const useUpdateProduto = () => {
  const queryClient = useQueryClient();
  return useMutation<Produto, Error, UpdateProdutoPayload>({
    mutationFn: updateProduto,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["produtos"] });
      queryClient.invalidateQueries({ queryKey: ["produtos", data.id] });
    },
  });
};

export const useDeleteProduto = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: deleteProduto,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["produtos"] });
    },
  });
};
