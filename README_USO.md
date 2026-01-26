# Manual de Uso do Projeto

Este guia explica como configurar e rodar a aplicação utilizando Docker.

## Pré-requisitos

Certifique-se de ter instalado:
- **Docker** e **Docker Compose**

---

## 🚀 Como Rodar (Modo Rápido)

Com o Docker instalado, você pode subir toda a aplicação (Banco de Dados + API + Frontend) com um único comando:

```bash
docker compose up --build -d
```

O comando irá:
1. Subir o banco PostgreSQL.
2. Buildar a aplicação Next.js (Imagem otimizada).
3. Iniciar o servidor na porta **3000**.

Acesse: [http://localhost:3000](http://localhost:3000)

> **Nota:** As migrações do banco e a geração do Prisma Client são feitas automaticamente durante o build do Dockerfile.

---

## Configuração Local (Opcional - Sem Docker para o App)

Caso prefira rodar o **Next.js** localmente (fora do Docker) enquanto mantém o banco no Docker:

### Passo 1: Dependências
```bash
npm install
```

### Passo 2: Banco de Dados
```bash
# Sobe apenas o banco
docker compose up db -d
```

### Passo 3: Variáveis de Ambiente
Crie um arquivo `.env`:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/postgres"
```

### Passo 4: Inicializar Prisma
```bash
npx prisma generate
```

### Passo 5: Rodar
```bash
npm run dev
```

---

## 2. Funcionalidades e Uso

O sistema é dividido em abas para facilitar a navegação:

### Aba "Categorias"
- **Visualizar:** Lista todas as categorias cadastradas.
- **Criar:** Use o botão "Nova Categoria" para adicionar (Ex: Eletrônicos, Móveis).
- **Ações:** Edição e Exclusão.

### Aba "Produtos"
- **Visualizar:** Lista de produtos com paginação. Use a barra de busca para filtrar por nome ou SKU.
- **Criar:** Clique em "Novo Produto". Obrigatório informar SKU, Nome e (opcionalmente) Categoria/Marca.
- **Estoque Mínimo:** Defina um alerta de estoque mínimo ao criar/editar.

### Aba "Estoques" (Estado Atual)
- **Painel de Controle:** Mostra quanto de cada item existe fisicamente.
- **Filtro Crítico:** Você pode filtrar para ver apenas produtos com estoque baixo/crítico.
- **Nota:** Não é possível editar a quantidade diretamente aqui. A quantidade só muda via "Movimentações".

### Aba "Estoque Movimentações"
- **Histórico:** Veja todas as entradas e saídas.
- **Registrar Movimentação:**
    1. Clique em "Nova Movimentação".
    2. Selecione o Produto (pelo SKU/Nome).
    3. Digite a Quantidade.
    4. Escolha o Tipo ("Entrada" para adicionar, "Saída" para remover).
    5. Ao salvar, o saldo na aba "Estoques" será atualizado automaticamente.
