const { GamesService } = require("../games.service");
const { PrismaService } = require("../../database/prisma.service");
const { GameLogicService } = require("../game-logic.service");
const { GameFactory } = require("../game.factory");
const { LogsService } = require("../../logs/logs.service");
const { EventBusService } = require("../../events/event-bus.service");

describe("GamesService", () => {
  let gamesService;
  let prismaService;
  let gameLogicService;
  let gameFactory;
  let logsService;
  let eventBusService;

  beforeEach(() => {
    prismaService = {
      gameInvitation: {
        create: jest.fn(),
        findFirst: jest.fn(),
        findUnique: jest.fn(),
        findMany: jest.fn(),
        update: jest.fn(),
      },
      game: {
        create: jest.fn(),
        findUnique: jest.fn(),
        findMany: jest.fn(),
        update: jest.fn(),
      },
      move: {
        create: jest.fn(),
      },
      user: {
        findUnique: jest.fn(),
      },
    };
    gameLogicService = {};
    gameFactory = {
      createGameInvitation: jest.fn(),
      createGame: jest.fn(),
      createMove: jest.fn(),
    };
    logsService = {
      logEvent: jest.fn(),
      logGameEvent: jest.fn(),
    };
    eventBusService = {
      emitGameInvitationSent: jest.fn(),
      emitGameInvitationAccepted: jest.fn(),
      emitGameInvitationRejected: jest.fn(),
    };
    gamesService = new GamesService(
      prismaService,
      gameLogicService,
      gameFactory,
      logsService,
      eventBusService,
    );
  });

  it("should be defined", () => {
    expect(gamesService).toBeDefined();
  });

  describe("createInvitation", () => {
    it("should create a game invitation", async () => {
      const fromUserId = 1;
      const toUserId = 2;
      prismaService.user.findUnique.mockResolvedValue({
        id: toUserId,
        isOnline: true,
      });
      prismaService.gameInvitation.findFirst.mockResolvedValue(null);
      gameFactory.createGameInvitation.mockReturnValue({
        fromUserId,
        toUserId,
        status: "PENDING",
      });
      prismaService.gameInvitation.create.mockResolvedValue({
        id: 1,
        fromUserId,
        toUserId,
        status: "PENDING",
      });

      await gamesService.createInvitation(fromUserId, toUserId);

      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: toUserId },
      });
      expect(prismaService.gameInvitation.findFirst).toHaveBeenCalled();
      expect(gameFactory.createGameInvitation).toHaveBeenCalledWith(
        fromUserId,
        toUserId,
      );
      expect(prismaService.gameInvitation.create).toHaveBeenCalled();
      expect(logsService.logEvent).toHaveBeenCalledWith(
        "GAME_INVITATION_CREATED",
        { invitationId: 1, fromUserId, toUserId },
      );
      expect(eventBusService.emitGameInvitationSent).toHaveBeenCalled();
    });
  });

  // Add more tests for other methods like acceptInvitation, rejectInvitation, makeMove, abandonGame, getGame, getUserGames, getPendingInvitations, getSentInvitations
});
