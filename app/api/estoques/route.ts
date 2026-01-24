import * as service from "@/services/estoque.service";
import { NextResponse } from "next/server";

export async function GET() {
  const estoques = await service.getAllEstoque();
  const estoquesSerialized = estoques.map(estoque => {
    return JSON.parse(
      JSON.stringify(estoque, (_key, value) => typeof value === 'bigint' ? value.toString() : value)
    )
  });
  return NextResponse.json(estoquesSerialized);
}