import * as service from "@/services/estoque.service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const filters = {
    search: searchParams.get("search") || undefined,
    categoria_id: searchParams.get("categoria_id") || undefined,
    critical: searchParams.get("critical") === "true",
    page: Number(searchParams.get("page")) || 1,
    limit: Number(searchParams.get("limit")) || 10,
  };

  const result = await service.getAllEstoque(filters);

  const serialized = JSON.parse(
    JSON.stringify(result, (_key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    )
  );

  return NextResponse.json(serialized);
}