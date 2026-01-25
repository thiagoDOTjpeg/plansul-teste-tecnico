import { Prisma, produtos } from '@/generated/prisma/client';
import prisma from '@/lib/db';

export interface ProdutosFilters {
  search?: string;
  categoria_id?: string;
  page?: number;
  limit?: number;
}

export const findAll = async (filters: ProdutosFilters) => {
  const { search, categoria_id, page = 1, limit = 10 } = filters;
  const skip = (page - 1) * limit;

  const where: Prisma.produtosWhereInput = {
    AND: [
      search ? {
        OR: [
          { nome: { contains: search, mode: 'insensitive' } },
          { sku: { contains: search, mode: 'insensitive' } },
          { marca: { contains: search, mode: 'insensitive' } }
        ]
      } : {},
      categoria_id ? { categorias: { id: BigInt(categoria_id) } } : {},
    ]
  }

  const [data, total] = await Promise.all([
    prisma.produtos.findMany({
      where,
      include: { categorias: true },
      skip,
      take: limit,
      orderBy: { criado_em: "desc" }
    }),
    prisma.produtos.count({ where })
  ]);

  const lastPage = Math.ceil(total / limit);

  return { data, total, page, limit, lastPage }
};

export const findById = async (id: bigint): Promise<produtos | null> => {
  return prisma.produtos.findUnique({
    where: { id },
    include: { categorias: true },
  });
};

export const create = async (data: Omit<produtos, 'id' | 'criado_em'>): Promise<produtos> => {
  const { sku, nome, categoria_id, estoque_minimo, marca } = data;

  return prisma.produtos.create({
    data: {
      sku,
      nome,
      categoria_id,
      estoque_minimo,
      marca,
    },
  });
};

export const update = async (id: bigint, data: Partial<Omit<produtos, 'id' | 'criado_em'>>): Promise<produtos> => {
  return prisma.produtos.update({
    where: { id },
    data,
  });
};

export const remove = async (id: bigint): Promise<produtos> => {
  return prisma.produtos.delete({
    where: { id },
  });
};
