# Manual de Uso do Projeto

Este guia explica como configurar o ambiente, rodar a aplicação e utilizar as funcionalidades do sistema.

## Pré-requisitos

Certifique-se de ter instalado:
- **Node.js** (v18 ou superior recomendado)
- **Docker** e **Docker Compose** (para o banco de dados)

## 1. Configuração e Execução

### Passo 1: Instalar dependências
Na raiz do projeto, execute:
```bash
npm install
```

### Passo 2: Subir o Banco de Dados
Inicie o container do PostgreSQL:
```bash
docker compose up -d
```

### Passo 3: Configurar Variáveis de Ambiente
Crie um arquivo `.env` na raiz do projeto conforme o modelo abaixo:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/postgres"
```
*(Nota: A porta padrão configurada no docker-compose deste projeto é 5433, diferente da padrão 5432, para evitar conflitos)*

### Passo 4: Inicializar o Banco (Prisma)
Gere os tipos do cliente Prisma:
```bash
npx prisma generate
```

*(Opcional: Se quiser popular o banco com dados iniciais, você pode rodar script SQL em `sql/init.sql` se disponível, ou criar dados pela aplicação)*

### Passo 5: Rodar a Aplicação
Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

Acesse: [http://localhost:3000](http://localhost:3000)

---

## 2. Funcionalidades e Uso

O sistema é dividido em abas para facilitar a navegação:

### Aba "Categorias"
- **Visualizar:** Lista todas as categorias cadastradas.
- **Criar:** Use o botão "Nova Categoria" para adicionar (Ex: Eletrônicos, Móveis).
- **Ações:** Edição e Exclusão (se implementado botões na lista).

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

---

## 3. Comandos Úteis

- **Lint:** `npm run lint` (Verifica qualidade do código)
- **Build:** `npm run build` (Gera versão de produção)
- **Start:** `npm run start` (Roda versão de produção)
