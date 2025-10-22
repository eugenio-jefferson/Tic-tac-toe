# Arquitetura do Sistema - Tic-Tac-Toe Multiplayer

## 🏗️ Visão Geral da Arquitetura

O sistema Tic-Tac-Toe Multiplayer foi projetado seguindo uma arquitetura distribuída orientada a eventos, garantindo escalabilidade, manutenibilidade e performance.

## 📊 Diagrama de Componentes

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND (Next.js)                      │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │   AuthPage  │  │  Dashboard  │  │  GameBoard  │             │
│  └─────────────┘  └─────────────┘  └─────────────┘             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │    Lobby    │  │ Leaderboard │  │   Context   │             │
│  └─────────────┘  └─────────────┘  └─────────────┘             │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP/WebSocket
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        BACKEND (NestJS)                        │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │ AuthModule  │  │ UsersModule │  │ GamesModule │             │
│  └─────────────┘  └─────────────┘  └─────────────┘             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │EventsModule │  │ LogsModule  │  │DatabaseModule│             │
│  └─────────────┘  └─────────────┘  └─────────────┘             │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                 Event Bus Service                       │   │
│  │              (Observer Pattern)                         │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ Prisma ORM
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    DATABASE (PostgreSQL)                       │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │    Users    │  │    Games    │  │    Moves    │             │
│  └─────────────┘  └─────────────┘  └─────────────┘             │
│  ┌─────────────┐  ┌─────────────┐                               │
│  │Invitations  │  │    Logs     │                               │
│  └─────────────┘  └─────────────┘                               │
└─────────────────────────────────────────────────────────────────┘
```

## 🔄 Fluxo de Comunicação

### 1. Autenticação
```
Cliente → AuthController → AuthService → UsersService → Database
                                    ↓
                              JWT Token ← EventBus ← LogsService
```

### 2. Comunicação em Tempo Real
```
Cliente A → WebSocket → EventsGateway → EventBusService → Cliente B
                              ↓
                        Database (Logs)
```

### 3. Jogadas
```
Cliente → GameBoard → WebSocket → EventsGateway → GamesService
                                        ↓
                                 GameLogicService
                                        ↓
                                   Database
                                        ↓
                                 EventBusService
                                        ↓
                              Broadcast para Clientes
```

## 🏛️ Padrões de Arquitetura

### 1. Arquitetura em Camadas

#### Frontend (Presentation Layer)
- **Componentes React**: Interface de usuário
- **Context API**: Gerenciamento de estado global
- **API Client**: Comunicação com backend
- **Socket Client**: Comunicação em tempo real

#### Backend (Business Logic Layer)
- **Controllers**: Endpoints da API REST
- **Services**: Lógica de negócio
- **Gateways**: WebSocket handlers
- **Guards**: Autenticação e autorização

#### Data Layer
- **Prisma ORM**: Abstração do banco de dados
- **PostgreSQL**: Persistência de dados
- **Migrations**: Versionamento do schema

### 2. Arquitetura Orientada a Eventos

#### Event Bus (Observer Pattern)
```javascript
EventBusService
├── User Events
│   ├── user.online
│   ├── user.offline
│   └── user.registered
├── Game Events
│   ├── game.started
│   ├── game.move.made
│   ├── game.finished
│   └── game.abandoned
└── Invitation Events
    ├── invitation.sent
    ├── invitation.accepted
    └── invitation.rejected
```

#### Benefícios
- **Desacoplamento**: Módulos independentes
- **Escalabilidade**: Fácil adição de novos eventos
- **Manutenibilidade**: Código organizado e testável
- **Real-time**: Atualizações instantâneas

## 🔧 Padrões de Design Implementados

### 1. Singleton Pattern
```javascript
// PrismaService - Única instância de conexão com DB
class PrismaService extends PrismaClient {
  private static instance: PrismaService;
  
  public static getInstance(): PrismaService {
    if (!PrismaService.instance) {
      PrismaService.instance = new PrismaService();
    }
    return PrismaService.instance;
  }
}
```

### 2. Factory Pattern
```javascript
// GameFactory - Criação padronizada de objetos
class GameFactory {
  createGame(player1Id, player2Id) {
    return {
      player1Id,
      player2Id,
      board: Array(9).fill(null),
      currentPlayer: player1Id,
      status: 'WAITING',
      // ...
    };
  }
}
```

### 3. Observer Pattern
```javascript
// EventBusService - Sistema de eventos
class EventBusService extends EventEmitter {
  emitGameStarted(game) {
    this.emit('game.started', game);
  }
  
  onGameStarted(callback) {
    this.on('game.started', callback);
  }
}
```

## 🔐 Arquitetura de Segurança

### 1. Camadas de Segurança

#### Frontend
- **Input Validation**: Validação no cliente
- **Token Storage**: Armazenamento seguro de JWT
- **HTTPS**: Comunicação criptografada

#### Backend
- **Authentication**: JWT com expiração
- **Authorization**: Guards e middlewares
- **Input Sanitization**: Validação de dados
- **Password Hashing**: bcrypt com salt

#### Database
- **Connection Security**: SSL/TLS
- **User Permissions**: Acesso limitado
- **Data Encryption**: Senhas criptografadas

### 2. Fluxo de Autenticação
```
1. Login Request → AuthController
2. Password Verification → bcrypt.compare()
3. JWT Generation → JwtService.sign()
4. Token Response → Client Storage
5. Protected Requests → JwtAuthGuard
6. Token Validation → JwtService.verify()
7. User Context → Request.user
```

## 📡 Comunicação em Tempo Real

### WebSocket Architecture
```
┌─────────────┐    WebSocket    ┌─────────────┐
│   Client A  │ ←──────────────→ │   Gateway   │
└─────────────┘                 └─────────────┘
                                       │
┌─────────────┐    WebSocket           │
│   Client B  │ ←──────────────────────┤
└─────────────┘                       │
                                       ▼
                              ┌─────────────┐
                              │  Event Bus  │
                              └─────────────┘
```

### Eventos WebSocket
- **Connection Management**: Autenticação via token
- **Room Management**: Jogadores por partida
- **Event Broadcasting**: Notificações em tempo real
- **Error Handling**: Tratamento de desconexões

## 🗄️ Modelo de Dados

### Relacionamentos
```
Users (1:N) ←→ Games (Player1)
Users (1:N) ←→ Games (Player2)
Users (1:N) ←→ Moves
Users (1:N) ←→ GameInvitations (From)
Users (1:N) ←→ GameInvitations (To)
Games (1:N) ←→ Moves
Games (1:N) ←→ Logs
```

### Índices de Performance
- `users.username` (UNIQUE)
- `games.player1Id, games.player2Id`
- `moves.gameId, moves.timestamp`
- `logs.timestamp, logs.type`

## 🚀 Escalabilidade

### Horizontal Scaling
- **Load Balancer**: Distribuição de carga
- **Multiple Instances**: Backend stateless
- **Database Clustering**: PostgreSQL cluster
- **Redis**: Cache e sessões compartilhadas

### Vertical Scaling
- **Resource Optimization**: CPU e memória
- **Database Tuning**: Índices e queries
- **Connection Pooling**: Prisma connection pool

## 📊 Monitoramento

### Logs Estruturados
```javascript
{
  type: 'GAME_EVENT',
  eventType: 'MOVE_MADE',
  gameId: 123,
  data: {
    playerId: 456,
    position: 4,
    symbol: 'X'
  },
  timestamp: '2023-12-01T10:30:00Z'
}
```

### Métricas
- **Response Time**: Tempo de resposta da API
- **WebSocket Connections**: Conexões ativas
- **Game Statistics**: Partidas por minuto
- **Error Rates**: Taxa de erros

## 🔄 CI/CD Pipeline

### Development
```
Code → Git → Tests → Build → Local Deploy
```

### Production
```
Code → Git → Tests → Build → Docker → Deploy → Monitor
```

## 📈 Performance Optimization

### Frontend
- **Code Splitting**: Carregamento sob demanda
- **Lazy Loading**: Componentes dinâmicos
- **Memoization**: React.memo e useMemo
- **Bundle Optimization**: Tree shaking

### Backend
- **Connection Pooling**: Prisma pool
- **Query Optimization**: Índices eficientes
- **Caching**: Redis para dados frequentes
- **Compression**: Gzip responses

### Database
- **Indexing Strategy**: Índices otimizados
- **Query Analysis**: EXPLAIN ANALYZE
- **Connection Limits**: Pool sizing
- **Backup Strategy**: Automated backups

## 🧪 Testabilidade

### Arquitetura Testável
- **Dependency Injection**: Fácil mock
- **Service Layer**: Lógica isolada
- **Event-Driven**: Testes de integração
- **API Contracts**: Testes de contrato

### Tipos de Teste
- **Unit Tests**: Serviços individuais
- **Integration Tests**: Módulos integrados
- **E2E Tests**: Fluxo completo
- **Load Tests**: Performance sob carga

Esta arquitetura garante um sistema robusto, escalável e manutenível, seguindo as melhores práticas de desenvolvimento de software moderno.

