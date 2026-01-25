import prisma from "@/lib/db";
import { estoque, Prisma } from "../app/generated/prisma/client";

export interface EstoqueFilters {
  search?: string;
  categoria_id?: string;
  critical?: boolean;
  page?: number;
  limit?: number;
}

export const findAll = async (filters: EstoqueFilters) => {
  const { search, categoria_id, page = 1, limit = 10 } = filters;
  const skip = (page - 1) * limit;

  const where: Prisma.estoqueWhereInput = {
    AND: [
      search ? {
        produtos: {
          OR: [
            { nome: { contains: search, mode: 'insensitive' } },
            { sku: { contains: search, mode: 'insensitive' } }
          ]
        }
      } : {},
      categoria_id ? { produtos: { categoria_id: BigInt(categoria_id) } } : {},
    ]
  };


  const [data, total] = await Promise.all([
    prisma.estoque.findMany({
      where,
      include: { produtos: true },
      skip,
      take: limit,
      orderBy: { atualizado_em: 'desc' }
    }),
    prisma.estoque.count({ where })
  ]);

  const lastPage = Math.ceil(total / limit);

  return { data, total, page, limit, lastPage };
};

export const findById = async (id: bigint): Promise<estoque | null> => {
  return prisma.estoque.findUnique({
    where: { id },
  });
};

export const findByProdutoId = async (produto_id: bigint): Promise<estoque | null> => {
  return prisma.estoque.findUnique({
    where: { produto_id }
  })
}

export const create = async (data: Omit<estoque, 'id' | 'atualizado_em'>): Promise<estoque> => {
  return prisma.estoque.create({
    data,
  });
};

export const update = async (id: bigint, data: Partial<Omit<estoque, 'id' | "produto_id">>): Promise<estoque> => {
  return prisma.estoque.update({
    where: { id },
    data,
  });
};

export const remove = async (id: bigint): Promise<estoque> => {
  return prisma.estoque.delete({
    where: { id },
  });
};
