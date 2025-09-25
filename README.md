# Tic-Tac-Toe Multiplayer Distributed System

Um sistema completo de jogo da velha multiplayer em rede desenvolvido com arquitetura distribuída, seguindo boas práticas de programação, segurança e padrões de design.

## 🚀 Tecnologias Utilizadas

### Backend
- **NestJS** (JavaScript) - Framework para Node.js
- **PostgreSQL** - Banco de dados relacional
- **Prisma ORM** - Object-Relational Mapping
- **Socket.IO** - Comunicação em tempo real via WebSockets
- **JWT** - Autenticação baseada em tokens
- **bcrypt** - Criptografia de senhas

### Frontend
- **Next.js** (JavaScript) - Framework React para aplicações web
- **React** - Biblioteca para interfaces de usuário
- **Socket.IO Client** - Cliente WebSocket
- **CSS Modules** - Estilização modular

### Banco de Dados
- **PostgreSQL** - Sistema de gerenciamento de banco de dados

## 📋 Pré-requisitos

Antes de executar o projeto, certifique-se de ter instalado:

- **Node.js** (versão 18 ou superior)
- **npm** ou **yarn**
- **PostgreSQL** (versão 12 ou superior)
- **Git**

## 🛠️ Instalação

### 1. Clone o repositório

```bash
git clone <url-do-repositorio>
cd tic-tac-toe-multiplayer
```

### 2. Configuração do Banco de Dados

#### Instalar PostgreSQL (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
```

#### Iniciar o serviço PostgreSQL
```bash
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

#### Criar banco de dados e usuário
```bash
sudo -u postgres psql -c "CREATE DATABASE tictactoe;"
sudo -u postgres psql -c "CREATE USER tictactoe_user WITH PASSWORD 'password';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE tictactoe TO tictactoe_user;"
sudo -u postgres psql -c "ALTER USER tictactoe_user CREATEDB;"
```

### 3. Configuração do Backend

#### Navegar para o diretório do backend
```bash
cd backend
```

#### Instalar dependências
```bash
npm install
```

#### Configurar variáveis de ambiente
Crie um arquivo `.env` no diretório `backend` com o seguinte conteúdo:

```env
# Database
DATABASE_URL="postgresql://tictactoe_user:password@localhost:5432/tictactoe?schema=public"

# JWT
JWT_SECRET="your-super-secret-jwt-key-here"
JWT_EXPIRES_IN="24h"

# Server
PORT=3001
NODE_ENV=development

# CORS
CORS_ORIGIN="http://localhost:3000"
```

#### Executar migrações do banco de dados
```bash
npx prisma generate
npx prisma migrate dev --name init
```

### 4. Configuração do Frontend

#### Navegar para o diretório do frontend
```bash
cd ../frontend
```

#### Instalar dependências
```bash
npm install
```

#### Configurar variáveis de ambiente
Crie um arquivo `.env.local` no diretório `frontend` com o seguinte conteúdo:

```env
# Backend API
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
```

## 🚀 Execução

### 1. Iniciar o Backend

```bash
cd backend
npm start
```

O backend estará disponível em: `http://localhost:3001`

### 2. Iniciar o Frontend

Em um novo terminal:

```bash
cd frontend
npm run dev
```

O frontend estará disponível em: `http://localhost:3000`

## 🎮 Como Usar

### 1. Cadastro/Login
- Acesse `http://localhost:3000`
- Crie uma nova conta ou faça login com uma conta existente
- O sistema suporta múltiplos usuários simultâneos

### 2. Lobby
- Após o login, você verá a lista de usuários online
- Convide outro usuário para uma partida clicando em "Convidar"
- Aceite ou rejeite convites recebidos

### 3. Jogo
- O primeiro jogador usa "X" e o segundo usa "O"
- Clique em uma célula vazia para fazer sua jogada
- O objetivo é formar uma linha de três símbolos iguais
- Você pode abandonar o jogo a qualquer momento

### 4. Ranking
- Visualize as estatísticas dos jogadores
- Veja vitórias, derrotas, empates e taxa de vitória
- O ranking é atualizado em tempo real

## 🏗️ Arquitetura do Sistema

### Padrões de Design Implementados

#### 1. Singleton Pattern
- **PrismaService**: Garante uma única instância de conexão com o banco de dados

#### 2. Observer Pattern
- **EventBusService**: Sistema de eventos para comunicação entre componentes
- **WebSocket Events**: Notificações em tempo real para todos os clientes conectados

#### 3. Factory Pattern
- **GameFactory**: Criação padronizada de jogos, convites e movimentos

### Arquitetura Orientada a Eventos

O sistema utiliza uma arquitetura baseada em eventos para garantir comunicação eficiente e desacoplada:

- **Event Bus**: Centraliza a comunicação entre módulos
- **WebSocket Gateway**: Gerencia conexões em tempo real
- **Database Events**: Logs de todas as ações do sistema

### Segurança Implementada

#### 1. Autenticação
- **JWT Tokens**: Autenticação stateless e segura
- **Password Hashing**: Senhas criptografadas com bcrypt (salt rounds: 12)

#### 2. Autorização
- **Guards**: Proteção de rotas sensíveis
- **User Validation**: Verificação de permissões em tempo real

#### 3. Comunicação Segura
- **CORS**: Configuração adequada para requisições cross-origin
- **Input Validation**: Validação de dados de entrada
- **Error Handling**: Tratamento seguro de erros sem exposição de dados sensíveis

## 📊 Estrutura do Banco de Dados

### Tabelas Principais

#### Users
- `id`: Identificador único
- `username`: Nome de usuário único
- `password`: Senha criptografada
- `isOnline`: Status de conexão
- `createdAt`: Data de criação
- `updatedAt`: Data de atualização

#### Games
- `id`: Identificador único
- `player1Id`: Referência ao primeiro jogador
- `player2Id`: Referência ao segundo jogador
- `board`: Estado do tabuleiro (JSON)
- `currentPlayer`: Jogador da vez
- `status`: Status do jogo (WAITING, IN_PROGRESS, FINISHED, ABANDONED)
- `winner`: Vencedor da partida
- `createdAt`: Data de criação
- `updatedAt`: Data de atualização

#### GameInvitations
- `id`: Identificador único
- `fromUserId`: Usuário que enviou o convite
- `toUserId`: Usuário que recebeu o convite
- `status`: Status do convite (PENDING, ACCEPTED, REJECTED, EXPIRED)
- `createdAt`: Data de criação
- `expiresAt`: Data de expiração

#### Moves
- `id`: Identificador único
- `gameId`: Referência ao jogo
- `playerId`: Jogador que fez a jogada
- `position`: Posição no tabuleiro (0-8)
- `symbol`: Símbolo usado (X ou O)
- `timestamp`: Momento da jogada

#### Logs
- `id`: Identificador único
- `type`: Tipo de log (EVENT, ERROR, GAME_EVENT)
- `eventType`: Tipo específico do evento
- `message`: Mensagem do log
- `data`: Dados adicionais (JSON)
- `gameId`: Referência ao jogo (opcional)
- `timestamp`: Momento do log

## 🧪 Testes

### Executar Testes do Backend
```bash
cd backend
npm test
```

### Executar Testes do Frontend
```bash
cd frontend
npm test
```

### Testes End-to-End
```bash
npm run test:e2e
```

## 📝 Scripts Disponíveis

### Backend
- `npm start`: Inicia o servidor em produção
- `npm run start:dev`: Inicia o servidor em modo desenvolvimento
- `npm test`: Executa os testes
- `npm run prisma:generate`: Gera o cliente Prisma
- `npm run prisma:migrate`: Executa migrações do banco
- `npm run prisma:studio`: Abre o Prisma Studio

### Frontend
- `npm run dev`: Inicia o servidor de desenvolvimento
- `npm run build`: Gera build de produção
- `npm start`: Inicia o servidor de produção
- `npm test`: Executa os testes

## 🔧 Troubleshooting

### Problemas Comuns

#### 1. Erro de Conexão com o Banco
```bash
# Verificar se o PostgreSQL está rodando
sudo systemctl status postgresql

# Reiniciar o PostgreSQL
sudo systemctl restart postgresql
```

#### 2. Porta já em uso
```bash
# Verificar processos usando a porta 3001
lsof -i :3001

# Matar processo se necessário
kill -9 <PID>
```

#### 3. Problemas com WebSocket
- Verificar se o CORS está configurado corretamente
- Confirmar se as URLs do frontend e backend estão corretas
- Verificar logs do navegador para erros de conexão

## 📈 Monitoramento e Logs

### Logs do Sistema
Todos os eventos são registrados no banco de dados na tabela `logs`:
- Logins e logouts de usuários
- Criação e finalização de partidas
- Erros do servidor
- Eventos de WebSocket

### Visualização de Logs
```bash
# Logs do backend
cd backend
npm run prisma:studio
```

## 🚀 Deploy em Produção

### Configurações Adicionais para Produção

#### 1. Variáveis de Ambiente
```env
NODE_ENV=production
JWT_SECRET="your-production-secret-key"
DATABASE_URL="postgresql://user:password@host:port/database"
```

#### 2. HTTPS/TLS
Para produção, configure HTTPS usando:
- Nginx como proxy reverso
- Certificados SSL (Let's Encrypt)
- Configuração adequada de CORS

#### 3. Banco de Dados
- Use um banco PostgreSQL dedicado
- Configure backups automáticos
- Monitore performance

## 📄 Licença

Este projeto foi desenvolvido como parte de um sistema educacional e demonstra boas práticas de desenvolvimento de software.

## 👥 Contribuição

Para contribuir com o projeto:
1. Faça um fork do repositório
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Abra um Pull Request

## 📞 Suporte

Para dúvidas ou problemas:
- Verifique a documentação
- Consulte os logs do sistema
- Abra uma issue no repositório

