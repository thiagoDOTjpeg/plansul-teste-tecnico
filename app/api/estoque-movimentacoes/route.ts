import * as service from "@/services/estoque-movimentacoes.service";
import { NextResponse } from "next/server";


export async function GET() {
  const estoqueMovimentacoes = await service.getAllEstoqueMovimentacoes();
  const estoqueMovimentacoesSerialized = estoqueMovimentacoes.map(estoqueMovimentacao => {
    return JSON.parse(
      JSON.stringify(estoqueMovimentacao, (_key, value) => typeof value === "bigint" ? value.toString() : value)
    )
  })
  return NextResponse.json(estoqueMovimentacoesSerialized);
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