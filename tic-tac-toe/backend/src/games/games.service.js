const {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  Inject,
} = require("@nestjs/common");
const { PrismaService } = require("../database/prisma.service");
const { GameLogicService } = require("./game-logic.service");
const { GameFactory } = require("./game.factory");
const { LogsService } = require("../logs/logs.service");

@Injectable()
class GamesService {
  constructor(
    @Inject(PrismaService) prisma,
    @Inject(GameLogicService) gameLogicService,
    @Inject(GameFactory)gameFactory,
    @Inject(LogsService)logsService
  ) {
    this.prisma = prisma;
    this.gameLogicService = gameLogicService;
    this.gameFactory = gameFactory;
    this.logsService = logsService;
  }

  async createInvitation(fromUserId, toUserId) {
    if (fromUserId === toUserId) {
      throw new BadRequestException("Cannot invite yourself");
    }

    const targetUser = await this.prisma.user.findUnique({
      where: { id: toUserId },
    });

    if (!targetUser) {
      throw new NotFoundException("User not found");
    }

    if (!targetUser.isOnline) {
      throw new BadRequestException("User is not online");
    }

    const existingInvitation = await this.prisma.gameInvitation.findFirst({
      where: {
        fromUserId,
        toUserId,
        status: "PENDING",
      },
    });

    if (existingInvitation) {
      throw new BadRequestException("Invitation already sent");
    }

    const invitationData = this.gameFactory.createGameInvitation(
      fromUserId,
      toUserId
    );

    const invitation = await this.prisma.gameInvitation.create({
      data: invitationData,
      include: {
        fromUser: {
          select: { id: true, username: true },
        },
        toUser: {
          select: { id: true, username: true },
        },
      },
    });

    await this.logsService.logEvent("GAME_INVITATION_CREATED", {
      invitationId: invitation.id,
      fromUserId,
      toUserId,
    });

    return invitation;
  }

  async acceptInvitation(invitationId, userId) {
    const invitation = await this.prisma.gameInvitation.findUnique({
      where: { id: invitationId },
      include: {
        fromUser: true,
        toUser: true,
      },
    });

    if (!invitation) {
      throw new NotFoundException("Invitation not found");
    }

    if (invitation.toUserId !== userId) {
      throw new ForbiddenException("Not authorized to accept this invitation");
    }

    if (invitation.status !== "PENDING") {
      throw new BadRequestException("Invitation is no longer pending");
    }

    if (new Date() > invitation.expiresAt) {
      await this.prisma.gameInvitation.update({
        where: { id: invitationId },
        data: { status: "EXPIRED" },
      });
      throw new BadRequestException("Invitation has expired");
    }

    await this.prisma.gameInvitation.update({
      where: { id: invitationId },
      data: { status: "ACCEPTED" },
    });

    const gameData = this.gameFactory.createGame(
      invitation.fromUserId,
      invitation.toUserId
    );

    const game = await this.prisma.game.create({
      data: {
        ...gameData,
        board: JSON.stringify(gameData.board),
        status: "IN_PROGRESS",
      },
      include: {
        player1: {
          select: { id: true, username: true },
        },
        player2: {
          select: { id: true, username: true },
        },
      },
    });

    await this.logsService.logGameEvent(game.id, "GAME_STARTED", {
      player1Id: game.player1Id,
      player2Id: game.player2Id,
    });

    return {
      ...game,
      board: JSON.parse(game.board),
    };
  }

  async rejectInvitation(invitationId, userId) {
    const invitation = await this.prisma.gameInvitation.findUnique({
      where: { id: invitationId },
    });

    if (!invitation) {
      throw new NotFoundException("Invitation not found");
    }

    if (invitation.toUserId !== userId) {
      throw new ForbiddenException("Not authorized to reject this invitation");
    }

    if (invitation.status !== "PENDING") {
      throw new BadRequestException("Invitation is no longer pending");
    }

    await this.prisma.gameInvitation.update({
      where: { id: invitationId },
      data: { status: "REJECTED" },
    });

    await this.logsService.logEvent("GAME_INVITATION_REJECTED", {
      invitationId,
      fromUserId: invitation.fromUserId,
      toUserId: invitation.toUserId,
    });

    return { message: "Invitation rejected" };
  }

  async makeMove(gameId, playerId, position) {
    const game = await this.prisma.game.findUnique({
      where: { id: gameId },
      include: {
        player1: true,
        player2: true,
      },
    });

    if (!game) {
      throw new NotFoundException("Game not found");
    }

    if (game.status !== "IN_PROGRESS") {
      throw new BadRequestException("Game is not in progress");
    }

    if (game.player1Id !== playerId && game.player2Id !== playerId) {
      throw new ForbiddenException("Not a player in this game");
    }

    const board = JSON.parse(game.board);

    if (!this.gameLogicService.isPlayerTurn(game, playerId)) {
      throw new BadRequestException("Not your turn");
    }

    if (!this.gameLogicService.isValidMove(board, position)) {
      throw new BadRequestException("Invalid move");
    }

    const symbol = this.gameLogicService.getPlayerSymbol(game, playerId);
    const newBoard = this.gameLogicService.makeMove(board, position, symbol);

    const gameStatus = this.gameLogicService.getGameStatus(newBoard);
    const nextPlayer = this.gameLogicService.getNextPlayer(game);

    const moveData = this.gameFactory.createMove(gameId, playerId, position);
    moveData.symbol = symbol;

    await this.prisma.move.create({
      data: moveData,
    });

    const updatedGame = await this.prisma.game.update({
      where: { id: gameId },
      data: {
        board: JSON.stringify(newBoard),
        currentPlayer: gameStatus.status === "FINISHED" ? null : nextPlayer,
        status: gameStatus.status,
        winner:
          gameStatus.winner === "X"
            ? game.player1Id
            : gameStatus.winner === "O"
            ? game.player2Id
            : null,
        updatedAt: new Date(),
      },
      include: {
        player1: {
          select: { id: true, username: true },
        },
        player2: {
          select: { id: true, username: true },
        },
      },
    });

    await this.logsService.logGameEvent(gameId, "MOVE_MADE", {
      playerId,
      position,
      symbol,
      gameStatus: gameStatus.status,
    });

    if (gameStatus.status === "FINISHED") {
      await this.logsService.logGameEvent(gameId, "GAME_FINISHED", {
        winner: updatedGame.winner,
        isDraw: gameStatus.isDraw,
      });
    }

    return {
      ...updatedGame,
      board: newBoard,
      gameStatus,
    };
  }

  async abandonGame(gameId, playerId) {
    const game = await this.prisma.game.findUnique({
      where: { id: gameId },
      include: {
        player1: true,
        player2: true,
      },
    });

    if (!game) {
      throw new NotFoundException("Game not found");
    }

    if (game.player1Id !== playerId && game.player2Id !== playerId) {
      throw new ForbiddenException("Not a player in this game");
    }

    if (game.status !== "IN_PROGRESS") {
      throw new BadRequestException("Game is not in progress");
    }

    const winnerId =
      game.player1Id === playerId ? game.player2Id : game.player1Id;

    const updatedGame = await this.prisma.game.update({
      where: { id: gameId },
      data: {
        status: "ABANDONED",
        winner: winnerId,
        updatedAt: new Date(),
      },
      include: {
        player1: {
          select: { id: true, username: true },
        },
        player2: {
          select: { id: true, username: true },
        },
      },
    });

    await this.logsService.logGameEvent(gameId, "GAME_ABANDONED", {
      abandonedBy: playerId,
      winner: winnerId,
    });

    return {
      ...updatedGame,
      board: JSON.parse(updatedGame.board),
    };
  }

  async getGame(gameId, userId) {
    const game = await this.prisma.game.findUnique({
      where: { id: gameId },
      include: {
        player1: {
          select: { id: true, username: true },
        },
        player2: {
          select: { id: true, username: true },
        },
        moves: {
          orderBy: { timestamp: "asc" },
        },
      },
    });

    if (!game) {
      throw new NotFoundException("Game not found");
    }

    if (game.player1Id !== userId && game.player2Id !== userId) {
      throw new ForbiddenException("Not authorized to view this game");
    }

    return {
      ...game,
      board: JSON.parse(game.board),
    };
  }

  async getUserGames(userId, status = null) {
    const where = {
      OR: [{ player1Id: userId }, { player2Id: userId }],
    };

    if (status) {
      where.status = status;
    }

    const games = await this.prisma.game.findMany({
      where,
      include: {
        player1: {
          select: { id: true, username: true },
        },
        player2: {
          select: { id: true, username: true },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    return games.map((game) => ({
      ...game,
      board: JSON.parse(game.board),
    }));
  }

  async getPendingInvitations(userId) {
    const invitations = await this.prisma.gameInvitation.findMany({
      where: {
        toUserId: userId,
        status: "PENDING",
        expiresAt: {
          gt: new Date(),
        },
      },
      include: {
        fromUser: {
          select: { id: true, username: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return invitations;
  }

  async getSentInvitations(userId) {
    const invitations = await this.prisma.gameInvitation.findMany({
      where: {
        fromUserId: userId,
        status: "PENDING",
        expiresAt: {
          gt: new Date(),
        },
      },
      include: {
        toUser: {
          select: { id: true, username: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return invitations;
  }
}

module.exports = { GamesService };
