import { produtos } from '@/generated/prisma/client';
import prisma from '@/lib/db';
import * as repository from '@/repositories/produtos.repository';

export const getAllProdutos = async (): Promise<produtos[]> => {
  return repository.findAll();
};

export const getProdutoById = async (id: bigint): Promise<produtos | null> => {
  return repository.findById(id);
};


export const createProduto = async (data: Omit<produtos, 'id' | 'criado_em'>): Promise<produtos> => {
  const { sku, nome, categoria_id, estoque_minimo, marca } = data;
  const result = await prisma.$transaction(async (tx) => {
    const produto = await tx.produtos.create({
      data: { sku, nome, categoria_id, estoque_minimo, marca },
    });
    await tx.estoque.create({
      data: {
        produto_id: produto.id,
        quantidade: 0,
      },
    });
    return produto;
  });
  return result;
};

export const updateProduto = async (id: bigint, data: Partial<Omit<produtos, 'id' | 'criado_em'>>): Promise<produtos> => {
  return repository.update(id, data);
};

export const deleteProduto = async (id: bigint): Promise<produtos> => {
  return repository.remove(id);
};
