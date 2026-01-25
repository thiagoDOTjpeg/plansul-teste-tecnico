import prisma from "@/lib/db";
import { estoque_movimentacoes, Prisma } from "../app/generated/prisma/client";

export interface EstoqueMovimentacaoFilters {
  search?: string;
  tipo?: "entrada" | "saida";
  page?: number;
  limit?: number;
}

export const findAll = async (filters: EstoqueMovimentacaoFilters = {}): Promise<{ data: estoque_movimentacoes[]; total: number; page: number; limit: number; lastPage: number }> => {
  const { search, tipo, page = 1, limit = 10 } = filters;
  const skip = (page - 1) * limit;

  const where: Prisma.estoque_movimentacoesWhereInput = {
    AND: [
      tipo ? { tipo } : {},
      search ? {
        produtos: {
          OR: [
            { sku: { contains: search, mode: 'insensitive' } },
            { nome: { contains: search, mode: 'insensitive' } },
            { marca: { contains: search, mode: 'insensitive' } }
          ]
        }
      } : {},
    ]
  };

  const [data, total] = await Promise.all([
    prisma.estoque_movimentacoes.findMany({
      where,
      include: { produtos: true },
      skip,
      take: limit,
      orderBy: { criado_em: 'desc' }
    }),
    prisma.estoque_movimentacoes.count({ where })
  ]);

  const lastPage = Math.ceil(total / limit);

  return { data, total, page, limit, lastPage };
};

export const findById = async (id: bigint): Promise<estoque_movimentacoes | null> => {
  return prisma.estoque_movimentacoes.findUnique({
    where: { id },
  });
};

export const create = async (data: Omit<estoque_movimentacoes, 'id' | 'criado_em'>): Promise<estoque_movimentacoes> => {
  return prisma.estoque_movimentacoes.create({
    data,
  });
};

export const update = async (id: bigint, data: Partial<Omit<estoque_movimentacoes, 'id' | "criado_em" | "produto_id">>): Promise<estoque_movimentacoes> => {
  return prisma.estoque_movimentacoes.update({
    where: { id },
    data,
  });
};

export const remove = async (id: bigint): Promise<estoque_movimentacoes> => {
  return prisma.estoque_movimentacoes.delete({
    where: { id },
  });
};