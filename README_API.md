# Documentação da API

Esta API fornece endpoints para gerenciar categorias, produtos, estoque e movimentações.

## Base URL
Por padrão, a API é acessível em: `http://localhost:3000/api`

---

## 1. Categorias

### Listar Categorias
Retorna todas as categorias cadastradas.

**Endpoint:** `GET /categorias`

**Exemplo de Resposta:**
```json
[
  {
    "id": "1",
    "nome": "Eletrônicos",
    "descricao": "Dispositivos eletrônicos diversos",
    "criado_em": "2024-01-25T10:00:00.000Z"
  }
]
```

### Criar Categoria
Cria uma nova categoria.

**Endpoint:** `POST /categorias`

**Body:**
```json
{
  "nome": "Roupas",
  "descricao": "Vestuário em geral"
}
```

**Exemplo de Resposta (201 Created):**
```json
{
  "id": "2",
  "nome": "Roupas",
  "descricao": "Vestuário em geral",
  "criado_em": "2024-01-25T10:05:00.000Z"
}
```

---

## 2. Produtos

### Listar Produtos
Lista produtos com paginação e filtros.

**Endpoint:** `GET /produtos`

**Parâmetros (Query Params):**
- `search` (opcional): Busca por nome, SKU ou marca.
- `categoria_id` (opcional): Filtra por ID da categoria.
- `page` (opcional): Número da página (padrão: 1).
- `limit` (opcional): Itens por página (padrão: 10).

**Exemplo de Request:**
`GET /produtos?search=iphone&page=1&limit=5`

**Exemplo de Resposta:**
```json
{
  "data": [
    {
      "id": "10",
      "sku": "IPH-13",
      "nome": "iPhone 13",
      "marca": "Apple",
      "estoque_minimo": 5,
      ...
    }
  ],
  "total": 50,
  "page": 1,
  "limit": 5,
  "lastPage": 10
}
```

### Criar Produto
Cria um novo produto.

**Endpoint:** `POST /produtos`

**Body:**
```json
{
  "sku": "TSH-001",
  "nome": "Camiseta Básica",
  "categoria_id": "2",  // Opcional
  "estoque_minimo": 10,
  "marca": "Hering"     // Opcional
}
```

---

## 3. Estoque (Estado Atual)

### Listar Estado do Estoque
Retorna a quantidade atual de estoque para cada produto (calculado via tabela `estoque`).

**Endpoint:** `GET /estoques`

**Parâmetros (Query Params):**
- `search` (opcional): Busca por nome do produto ou SKU.
- `categoria_id` (opcional): Filtra por categoria.
- `critical` (opcional): Se `true`, retorna apenas produtos com estoque abaixo do mínimo.
- `page` (opcional): Número da página.
- `limit` (opcional): Itens por página.

**Exemplo de Resposta:**
```json
{
  "data": [
    {
      "id": "5",
      "produto_id": "10",
      "quantidade": 15,
      "atualizado_em": "...",
      "produtos": {
        "nome": "iPhone 13",
        "sku": "IPH-13",
        "estoque_minimo": 5
      }
    }
  ],
  "total": 1,
  ...
}
```

---

## 4. Movimentações de Estoque

### Listar Movimentações
Histórico de entradas e saídas de produtos.

**Endpoint:** `GET /estoque-movimentacoes`

**Parâmetros (Query Params):**
- `search` (opcional): Busca por produto.
- `tipo` (opcional): `entrada` ou `saida`.
- `page` (opcional): Paginação.
- `limit` (opcional): Paginação.

**Exemplo de Resposta:**
```json
{
  "data": [
    {
      "id": "100",
      "produto_id": "10",
      "quantidade": 5,
      "tipo": "entrada",
      "criado_em": "2024-01-25T12:00:00.000Z",
      "produtos": { "nome": "iPhone 13" }
    }
  ],
  ...
}
```

### Registrar Movimentação
Registra uma entrada ou saída de estoque e atualiza automaticamente o saldo no `estoque`.

**Endpoint:** `POST /estoque-movimentacoes`

**Body:**
```json
{
  "produto_id": "10",
  "quantidade": 5,
  "tipo_movimentacao": "entrada" // ou "saida"
}
```

**Erros Comuns:**
- `400 Bad Request`: Quantidade negativa ou campos faltando.
