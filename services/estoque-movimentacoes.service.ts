import prisma from "@/lib/db";
import * as estoqueRepository from "@/repositories/estoque.repository";
import { estoque_movimentacoes } from '../app/generated/prisma/client';
import * as repository from '../repositories/estoque-movimentacoes.repository';

export const getAllEstoqueMovimentacoes = async (): Promise<estoque_movimentacoes[]> => {
  return repository.findAll();
};

export const getEstoqueMovimentacaoById = async (id: bigint): Promise<estoque_movimentacoes | null> => {
  return repository.findById(id);
};

export const createEstoqueMovimentacao = async (data: Omit<estoque_movimentacoes, 'id' | 'criado_em'>): Promise<estoque_movimentacoes> => {
  const { produto_id, quantidade, tipo } = data;
  const estoqueAtual = await estoqueRepository.findByProdutoId(produto_id);

  if (!estoqueAtual) throw new Error("Estoque não encontrado");

  const resultadoOperacao = tipo === "entrada" ? estoqueAtual.quantidade + quantidade : estoqueAtual.quantidade - quantidade;
  if (resultadoOperacao < 0) {
    throw new Error("Quantidade de movimentação inválida para a quantidade do estoque");
  }

  return await prisma.$transaction(async (tx) => {
    await tx.estoque.update({
      where: { id: estoqueAtual.id },
      data: {
        quantidade: resultadoOperacao,
        atualizado_em: new Date()
      }
    });

    const newEstoqueMovimentacao = await tx.estoque_movimentacoes.create({ data: { produto_id, quantidade, tipo } });
    return newEstoqueMovimentacao
  })
};

export const updateEstoqueMovimentacao = async (id: bigint, data: Partial<Omit<estoque_movimentacoes, 'id' | 'criado_em'>>): Promise<estoque_movimentacoes> => {
  return repository.update(id, data);
};

export const deleteEstoqueMovimentacao = async (id: bigint): Promise<estoque_movimentacoes> => {
  return repository.remove(id);
};
