import prisma from "@/lib/db";
import { estoque_movimentacoes } from '../app/generated/prisma/client';
import * as repository from '../repositories/estoque-movimentacoes.repository';

export const getAllEstoqueMovimentacoes = async (filters?: repository.EstoqueMovimentacaoFilters) => {
  return repository.findAll(filters || {});
};

export const getEstoqueMovimentacaoById = async (id: bigint): Promise<estoque_movimentacoes | null> => {
  return repository.findById(id);
};

export const createEstoqueMovimentacao = async (data: Omit<estoque_movimentacoes, 'id' | 'criado_em'>): Promise<estoque_movimentacoes> => {
  const { produto_id, quantidade, tipo } = data;
  const quantidadeNumber = Number(quantidade)

  return await prisma.$transaction(async (tx) => {
    const estoqueAtual = await tx.estoque.findUnique({
      where: { produto_id }
    });

    if (!estoqueAtual) throw new Error("Estoque não encontrado para este produto");

    if (tipo === "saida" && estoqueAtual.quantidade < quantidadeNumber) {
      throw new Error("Quantidade insuficiente em estoque para esta saída");
    }

    await tx.estoque.update({
      where: { produto_id },
      data: {
        quantidade: {
          [tipo === "entrada" ? "increment" : "decrement"]: quantidadeNumber
        },
        atualizado_em: new Date()
      }
    });

    return await tx.estoque_movimentacoes.create({
      data: { produto_id, quantidade: quantidadeNumber, tipo }
    });
  });
};

export const updateEstoqueMovimentacao = async (id: bigint, data: Partial<Omit<estoque_movimentacoes, 'id' | 'criado_em'>>): Promise<estoque_movimentacoes> => {
  return repository.update(id, data);
};

export const deleteEstoqueMovimentacao = async (id: bigint): Promise<estoque_movimentacoes> => {
  return repository.remove(id);
};
