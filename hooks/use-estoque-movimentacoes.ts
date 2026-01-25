import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as z from "zod";

export const createEstoqueMovimentacaoSchema = z.object({
  produto_id: z.string(),
  quantidade: z.string(),
  tipo_movimentacao: z.enum(["entrada", "saida"])
});

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

const fetchEstoqueMovimentacoes = async (): Promise<EstoqueMovimentacao[]> => {
  const response = await fetch("/api/estoque-movimentacoes");
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

export const useEstoqueMovimentacoes = () => {
  return useQuery<EstoqueMovimentacao[], Error>({
    queryKey: ["estoque-movimentacoes"],
    queryFn: fetchEstoqueMovimentacoes,
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