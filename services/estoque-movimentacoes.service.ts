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
  const newProduto = await repository.create({ produto_id, quantidade, tipo });
  return newProduto;
};

export const updateEstoqueMovimentacao = async (id: bigint, data: Partial<Omit<estoque_movimentacoes, 'id' | 'criado_em'>>): Promise<estoque_movimentacoes> => {
  return repository.update(id, data);
};

export const deleteEstoqueMovimentacao = async (id: bigint): Promise<estoque_movimentacoes> => {
  return repository.remove(id);
};
