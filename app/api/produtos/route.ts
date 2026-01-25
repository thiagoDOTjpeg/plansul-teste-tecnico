import * as service from '@/services/produtos.service';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const filters = {
    search: searchParams.get("search") || undefined,
    categoria_id: searchParams.get("categoria_id") || undefined,
    page: Number(searchParams.get("page")) || 1,
    limit: Number(searchParams.get("limit")) || 10,
  }

  const result = await service.getAllProdutos(filters);

  const serialized = JSON.parse(
    JSON.stringify(result, (_key, value) =>
      typeof value === "bigint" ? value.toString() : value)
  )

  return NextResponse.json(serialized)
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { sku, nome, categoria_id, estoque_minimo, marca } = body;

    if (!sku || !nome) {
      return NextResponse.json({ error: 'SKU e Nome são obrigatórios' }, { status: 400 });
    }

    const newProduto = await service.createProduto({
      sku,
      nome,
      categoria_id: categoria_id ? BigInt(categoria_id) : null,
      estoque_minimo,
      marca,
    });
    const newProdutoSerialized = JSON.parse(
      JSON.stringify(newProduto, (key, value) =>
        typeof value === 'bigint' ? value.toString() : value
      )
    );
    return NextResponse.json(newProdutoSerialized, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Falha ao criar produto' }, { status: 500 });
  }
}
