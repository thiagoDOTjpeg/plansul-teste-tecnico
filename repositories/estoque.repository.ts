import prisma from "@/lib/db";
import { estoque } from "../app/generated/prisma/client";

export const findAll = async (): Promise<estoque[]> => {
  return prisma.estoque.findMany({
    include: { produtos: true }
  });
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
