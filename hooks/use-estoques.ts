import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as z from "zod";

export const updateEstoqueSchema = z.object({
  id: z.string(),
  quantidade: z.string().min(0, "Quantidade é obrigatório")
})

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
    estoque_minimo: number
  }
}

export type UpdateEstoquePayload = z.infer<typeof updateEstoqueSchema>;

const fetchEstoques = async (): Promise<Estoque[]> => {
  const response = await fetch("/api/estoques");
  if (!response.ok) {
    throw new Error("Failed to fetch stocks");
  }
  return response.json();
}

const updateEstoque = async (payload: UpdateEstoquePayload): Promise<Estoque> => {
  const response = await fetch(`/api/estoques/${payload.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to update stock");
  }
  return response.json();
}

export const useEstoques = () => {
  return useQuery<Estoque[], Error>({
    queryKey: ["estoques"],
    queryFn: fetchEstoques,
  });
}

export const useUpdateEstoque = () => {
  const queryClient = useQueryClient();
  return useMutation<Estoque, Error, UpdateEstoquePayload>({
    mutationFn: updateEstoque,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["estoques"] });
      queryClient.invalidateQueries({ queryKey: ["estoques-movimentacoes"] });
    }
  })
}
