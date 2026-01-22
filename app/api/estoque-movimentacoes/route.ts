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