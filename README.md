# Tic-Tac-Toe Multiplayer

Um jogo da velha multiplayer em rede, desenvolvido com foco em arquitetura distribuída, comunicação em tempo real e boas práticas de segurança.
O sistema permite cadastro e autenticação de usuários, criação de partidas, convites em tempo real, ranking e estatísticas.
---
## Tecnologias
### Backend

* NestJS (JavaScript) – Framework Node.js
* Prisma ORM – Mapeamento objeto-relacional
* Socket.IO – Comunicação em tempo real via WebSockets
* JWT – Autenticação baseada em tokens
* bcrypt – Hash de senhas

### Frontend
* Next.js (JavaScript) – Framework React
* React – Interfaces de usuário
* Socket.IO Client – Cliente WebSocket
* CSS Modules – Estilização modular

### Banco de Dados

* PostgreSQL via Docker Compose

---

## Pré-requisitos

* Node.js (v18+)
* npm ou yarn
* Docker e Docker Compose
* Git

---

## Instalação

### 1. Clone o repositório

```bash
git clone <url-do-repositorio>
cd tic-tac-toe
```

### 2. Configuração do Backend

Entre no diretório do backend e instale as dependências:

```bash
cd backend
npm install
```

Crie um arquivo `.env` em `backend` com o seguinte conteúdo:

```env
# Database
DATABASE_URL="postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${CONNECTION_HOST}:${CONNECTION_PORT}/${POSTGRES_DB}"

POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres123
POSTGRES_DB=TicTacToe
DB_PORT=5432:5432

CONNECTION_PORT=5432
CONNECTION_HOST=localhost

RESTART_CONTAINER=no

# JWT
JWT_SECRET="your-super-secret-jwt-key-here"
JWT_EXPIRES_IN="24h"

# Server
PORT=3001
NODE_ENV=development

# CORS
CORS_ORIGIN="http://localhost:3000"
```

#### Caso a porta 5432 já esteja em uso:

```env
DB_PORT=5433:5433
CONNECTION_PORT=5433
```

---

### 3. Subir containers com Docker

```bash
docker-compose up -d
```

---

### 4. Executar migrações

```bash
npx prisma generate
npx prisma migrate dev --name init
```

---

### 5. Configuração do Frontend

Entre no diretório do frontend e instale as dependências:

```bash
cd ../frontend
npm install
```

Crie um arquivo `.env.local` em `frontend` com:

```env
# Backend API
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
```

---

## Execução

### Backend

```bash
cd backend
npm run start:dev
```

Disponível em: [http://localhost:3001](http://localhost:3001)

### Frontend

Em outro terminal:

```bash
cd frontend
npm run dev
```

Disponível em: [http://localhost:3000](http://localhost:3000)

---

## Funcionalidades

* Cadastro e login de usuários (autenticação com JWT e senhas criptografadas)
* Lista de usuários online
* Convite para partidas em tempo real
* Tabuleiro compartilhado via WebSockets
* Ranking com estatísticas de vitórias, derrotas e empates

---

## Testes

### Backend

```bash
cd backend
npm test
```

### Frontend

```bash
cd frontend
npm test
```

---

## Troubleshooting

### Containers (Docker)

Se ocorrer algum problema com os containers:

```bash
# subir containers
docker-compose up -d

# ver logs em tempo real
docker-compose logs -f

# parar containers
docker-compose down
```

### Porta em uso

Se a porta 5432 já estiver ocupada, altere no `.env`:

```env
DB_PORT=5433:5433
CONNECTION_PORT=5433
```

### WebSocket ou API não conectam

* Verifique se o backend está rodando em [http://localhost:3001](http://localhost:3001)
* Confirme que o frontend tem as variáveis de ambiente corretas em `.env.local`
* Veja os logs do container:

```bash
docker-compose logs backend -f
```

---

## Licença

Este projeto foi desenvolvido para fins educacionais e como demonstração de boas práticas em desenvolvimento web distribuído.

---

## Contribuidores

* [Erica](https://github.com/ericafalmeid)
* [Eugenio](https://github.com/eugenio-jefferson)
* [Akyssa](https://github.com/akyssaeduarda)

---