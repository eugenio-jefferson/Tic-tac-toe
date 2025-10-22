const {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} = require("@nestjs/websockets");
const { Server, Socket } = require("socket.io");
const { Injectable, Logger, UseGuards, Inject } = require("@nestjs/common");
const { JwtService } = require("@nestjs/jwt");
const { EventBusService } = require("./event-bus.service");
const { GamesService } = require("../games/games.service");
const { UsersService } = require("../users/users.service");
const { LogsService } = require("../logs/logs.service");

@WebSocketGateway({
  cors: {
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
  },
})
@Injectable()
class EventsGateway {
  @WebSocketServer()
  server;

  constructor(
    @Inject(JwtService) jwtService,
    @Inject(EventBusService) eventBusService,
    @Inject(GamesService) gamesService,
    @Inject(UsersService) usersService,
    @Inject(LogsService) logsService
  ) {
    this.jwtService = jwtService;
    this.eventBusService = eventBusService;
    this.gamesService = gamesService;
    this.usersService = usersService;
    this.logsService = logsService;
    this.logger = new Logger(EventsGateway.name);
    this.connectedUsers = new Map();
    this.userSockets = new Map(); 

    this.setupEventListeners();
  }

   parseGameBoard(game) {
    if (game && typeof game.board === 'string') {
      return { ...game, board: JSON.parse(game.board) };
    }
    return game;
  }

  setupEventListeners() {
    this.eventBusService.onUserOnline((data) => {
      this.server.emit("user:online", data);
    });

    this.eventBusService.onUserOffline((data) => {
      this.server.emit("user:offline", data);
    });

    this.eventBusService.onGameInvitationSent((data) => {
      const targetSocketId = this.connectedUsers.get(data.toUserId);
      if (targetSocketId) {
        this.server.to(targetSocketId).emit("game:invitation:received", data);
      }
    });

    this.eventBusService.onGameInvitationAccepted((data) => {
      const fromUserSocketId = this.connectedUsers.get(
        data.invitation.fromUserId
      );
      if (fromUserSocketId) {
        const payload = {
          ...data,
          game: this.parseGameBoard(data.game),
        };
        this.server.to(fromUserSocketId).emit("game:invitation:accepted", payload);
      }
    });

    this.eventBusService.onGameInvitationRejected((data) => {
      const fromUserSocketId = this.connectedUsers.get(data.fromUserId);
      if (fromUserSocketId) {
        this.server.to(fromUserSocketId).emit("game:invitation:rejected", data);
      }
    });

    this.eventBusService.onGameStarted((data) => {
      const player1SocketId = this.connectedUsers.get(data.player1Id);
      const player2SocketId = this.connectedUsers.get(data.player2Id);
      
      const parsedGame = this.parseGameBoard(data);

      if (player1SocketId) {
        this.server.to(player1SocketId).emit("game:started", parsedGame);
      }
      if (player2SocketId) {
        this.server.to(player2SocketId).emit("game:started", parsedGame);
      }
    });

    this.eventBusService.onMoveMade((data) => {
      const player1SocketId = this.connectedUsers.get(data.game.player1Id);
      const player2SocketId = this.connectedUsers.get(data.game.player2Id);

      const payload = {
        ...data,
        game: this.parseGameBoard(data.game),
      };

      if (player1SocketId) {
        this.server.to(player1SocketId).emit("game:move:made", payload);
      }
      if (player2SocketId) {
        this.server.to(player2SocketId).emit("game:move:made", payload);
      }
    });

    this.eventBusService.onGameFinished((data) => {
      const player1SocketId = this.connectedUsers.get(data.player1Id);
      const player2SocketId = this.connectedUsers.get(data.player2Id);

      const parsedGame = this.parseGameBoard(data);

      if (player1SocketId) {
        this.server.to(player1SocketId).emit("game:finished", parsedGame);
      }
      if (player2SocketId) {
        this.server.to(player2SocketId).emit("game:finished", parsedGame);
      }
    });

    this.eventBusService.onGameAbandoned((data) => {
      const player1SocketId = this.connectedUsers.get(data.player1Id);
      const player2SocketId = this.connectedUsers.get(data.player2Id);

      const parsedGame = this.parseGameBoard(data);
      
      if (player1SocketId) {
        this.server.to(player1SocketId).emit("game:abandoned", parsedGame);
      }
      if (player2SocketId) {
        this.server.to(player2SocketId).emit("game:abandoned", parsedGame);
      }
    });
  }

  async handleConnection(client) {
    try {
      const token =
        client.handshake.auth?.token ||
        client.handshake.headers?.authorization?.split(" ")[1];

      if (!token) {
        this.logger.warn(`Client ${client.id} connected without token`);
        client.disconnect();
        return;
      }

      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });

      const userId = payload.sub;
      const username = payload.username;

      this.connectedUsers.set(userId, client.id);
      this.userSockets.set(client.id, userId);

      await this.usersService.updateOnlineStatus(userId, true);

      this.eventBusService.emitUserOnline(userId, username);

      this.logger.log(
        `User ${username} (${userId}) connected with socket ${client.id}`
      );

      client.emit("connected", { userId, username });

      await this.logsService.logEvent(
        "USER_CONNECTED",
        `Usuário '${username}' (ID: ${userId}) conectado com socket ${client.id}.`,
        {
          userId,
          username,
          socketId: client.id,
        }
      );
    } catch (error) {
      this.logger.error(`Connection error for client ${client.id}:`, error);
      client.disconnect();
    }
  }

  async handleDisconnect(client) {
    try {
      const userId = this.userSockets.get(client.id);

      if (userId) {
        this.userSockets.delete(client.id);

        const userSockets = Array.from(this.userSockets.entries()).filter(
          ([, uId]) => uId === userId
        );

        if (userSockets.length === 0) {
          this.connectedUsers.delete(userId);
          await this.usersService.updateOnlineStatus(userId, false);

          const user = await this.usersService.findById(userId);
          if (user) {
            this.eventBusService.emitUserOffline(userId, user.username);
            this.logger.log(
              `User ${user.username} (${userId}) is now offline.`
            );
            await this.logsService.logEvent(
              "USER_DISCONNECTED",
              `Usuário '${user.username}' (ID: ${userId}) desconectado.`,
              {
                userId,
                username: user.username,
              }
            );
          }
        } else {
          this.connectedUsers.set(userId, userSockets[0][0]); 
          this.logger.log(
            `User with ID ${userId} disconnected a session, but remains online with other sessions.`
          );
        }
      }
    } catch (error) {
      this.logger.error(`Disconnect error for client ${client.id}:`, error);
    }
  }

  @SubscribeMessage("game:invite")
  async handleGameInvite(@ConnectedSocket() client, @MessageBody() data) {
    try {
      const userId = this.userSockets.get(client.id);
      if (!userId) {
        client.emit("error", { message: "Not authenticated" });
        return;
      }

      const invitation = await this.gamesService.createInvitation(
        userId,
        data.toUserId
      );
      this.eventBusService.emitGameInvitationSent(invitation);

      client.emit("game:invitation:sent", invitation);
    } catch (error) {
      this.logger.error("Error handling game invite:", error);
      client.emit("error", { message: error.message });
    }
  }

  @SubscribeMessage("game:move")
  async handleGameMove(@ConnectedSocket() client, @MessageBody() data) {
    try {
      const userId = this.userSockets.get(client.id);
      if (!userId) {
        client.emit("error", { message: "Not authenticated" });
        return;
      }

      const result = await this.gamesService.makeMove(
        data.gameId,
        userId,
        data.position
      );
      this.eventBusService.emitMoveMade(result, {
        playerId: userId,
        position: data.position,
        symbol: result.gameStatus.winner
          ? result.player1Id === userId
            ? "X"
            : "O"
          : result.player1Id === userId
          ? "X"
          : "O",
      });

      if (result.gameStatus.status === "FINISHED") {
        this.eventBusService.emitGameFinished(result);
      }
    } catch (error) {
      this.logger.error("Error handling game move:", error);
      client.emit("error", { message: error.message });
    }
  }

  @SubscribeMessage("game:abandon")
  async handleGameAbandon(@ConnectedSocket() client, @MessageBody() data) {
    try {
      const userId = this.userSockets.get(client.id);
      if (!userId) {
        client.emit("error", { message: "Not authenticated" });
        return;
      }

      const result = await this.gamesService.abandonGame(data.gameId, userId);
      this.eventBusService.emitGameAbandoned(result, userId);
    } catch (error) {
      this.logger.error("Error handling game abandon:", error);
      client.emit("error", { message: error.message });
    }
  }

  @SubscribeMessage("ping")
  handlePing(@ConnectedSocket() client) {
    client.emit("pong", { timestamp: new Date().toISOString() });
  }

  getConnectedUsersCount() {
    return this.connectedUsers.size;
  }

  getConnectedUsersList() {
    return Array.from(this.connectedUsers.keys());
  }
}

module.exports = { EventsGateway };
