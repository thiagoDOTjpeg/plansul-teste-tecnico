import * as service from "@/services/estoque.service";
import { NextResponse } from "next/server";

interface Params {
  params: Promise<{ id: string; }>;
}

export async function PUT(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const stockId = BigInt(id);

    const body = await request.json();
    const { quantidade } = body;
    const quantidadeNova = Number(quantidade);

    if (isNaN(quantidadeNova) || quantidadeNova < 0) {
      return NextResponse.json({ error: "Quantidade inválida ou negativa" }, { status: 400 });
    }

    const estoqueNovo = await service.adjustEstoque(stockId, quantidadeNova);

    const serialized = JSON.parse(
      JSON.stringify(estoqueNovo, (_, v) => typeof v === "bigint" ? v.toString() : v)
    );

    return NextResponse.json(serialized);

  } catch (error) {
    console.error("Erro no ajuste de estoque");

    if (error instanceof Error && error.message.includes("não encontrado")) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    if (error instanceof Error && error.message.includes("negativa")) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { error: "Erro interno ao processar o ajuste de estoque" },
      { status: 500 }
    );
  }
}