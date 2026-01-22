import { estoque } from '../app/generated/prisma/client';
import * as repository from '../repositories/estoque.repository';

export const getAllEstoque = async (): Promise<estoque[]> => {
  return repository.findAll();
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
