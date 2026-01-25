import * as service from "@/services/estoque-movimentacoes.service";
import { NextResponse } from "next/server";


export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const filters = {
    search: searchParams.get("search") || undefined,
    tipo: (searchParams.get("tipo") as "entrada" | "saida") || undefined,
    page: Number(searchParams.get("page")) || 1,
    limit: Number(searchParams.get("limit")) || 10,
  };

  const result = await service.getAllEstoqueMovimentacoes(filters);

  const dataSerialized = result.data.map(item => JSON.parse(
    JSON.stringify(item, (_key, value) => typeof value === "bigint" ? value.toString() : value)
  ));

  return NextResponse.json({ data: dataSerialized, total: result.total, page: result.page, limit: result.limit, lastPage: result.lastPage });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { produto_id, quantidade, tipo_movimentacao } = body

    if (!produto_id || !quantidade || !tipo_movimentacao) {
      return NextResponse.json({ error: "Id do produto, quantidade e o tipo de movimentação são obrigatórios" }, { status: 400 });
    }

    if (quantidade < 0) {
      return NextResponse.json({ error: "Quantidade não pode ser negativa" }, { status: 400 });
    }

    const newMovimentacao = await service.createEstoqueMovimentacao({
      produto_id,
      quantidade,
      tipo: tipo_movimentacao
    })
    const newMovimentacaoSerialized = JSON.parse(
      JSON.stringify(newMovimentacao, (_key, value) =>
        typeof value === "bigint" ? value.toString() : value)
    );

    return NextResponse.json(newMovimentacaoSerialized, { status: 201 })
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Falha ao criar movimentação de estoque" }, { status: 500 });
  }
}