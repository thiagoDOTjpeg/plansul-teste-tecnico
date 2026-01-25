import prisma from '@/lib/db';
import { estoque } from '../app/generated/prisma/client';
import * as repository from '../repositories/estoque.repository';

export const getAllEstoque = async (filters: repository.EstoqueFilters) => {
  const result = await repository.findAll(filters);
  return result;
};

export const getEstoqueById = async (id: bigint): Promise<estoque | null> => {
  return repository.findById(id);
};

export const createEstoque = async (data: Omit<estoque, 'id' | 'atualizado_em'>): Promise<estoque> => {
  const { produto_id, quantidade } = data;
  const newProduto = await repository.create({ produto_id, quantidade });
  return newProduto;
};

export const updateEstoque = async (id: bigint, data: Partial<Omit<estoque, 'id' | 'produto_id'>>): Promise<estoque> => {
  return repository.update(id, data);
};

export const deleteEstoque = async (id: bigint): Promise<estoque> => {
  return repository.remove(id);
};

export const adjustEstoque = async (id: bigint, quantidadeNova: number) => {
  if (quantidadeNova < 0) throw new Error("A quantidade total não pode ser negativa.");

  const estoqueAtual = await repository.findById(id);
  if (!estoqueAtual) throw new Error("Estoque não encontrado");

  const diff = Number(estoqueAtual.quantidade) - quantidadeNova;
  if (diff === 0) return estoqueAtual;

  const produtoIdVinculado = estoqueAtual.produto_id;
  const tipo = diff < 0 ? 'entrada' : 'saida';

  return await prisma.$transaction(async (tx) => {
    const updated = await tx.estoque.update({
      where: { id: id },
      data: {
        quantidade: quantidadeNova,
        atualizado_em: new Date()
      }
    });

    await tx.estoque_movimentacoes.create({
      data: {
        produto_id: produtoIdVinculado,
        quantidade: Math.abs(diff),
        tipo: tipo
      }
    });

    return updated;
  });
};
