const { GameFactory } = require("../game.factory");

describe("GameFactory", () => {
  let gameFactory;

  beforeEach(() => {
    gameFactory = new GameFactory();
  });

  it("should be defined", () => {
    expect(gameFactory).toBeDefined();
  });

  describe("createGame", () => {
    it("should create a new game object", () => {
      const player1Id = 1;
      const player2Id = 2;
      const game = gameFactory.createGame(player1Id, player2Id);

      expect(game).toEqual({
        player1Id: 1,
        player2Id: 2,
        board: Array(9).fill(null),
        currentPlayer: 1,
        status: "WAITING",
        winner: null,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    });
  });

  describe("createGameInvitation", () => {
    it("should create a new game invitation object", () => {
      const fromUserId = 1;
      const toUserId = 2;
      const invitation = gameFactory.createGameInvitation(fromUserId, toUserId);

      expect(invitation).toEqual({
        fromUserId: 1,
        toUserId: 2,
        status: "PENDING",
        createdAt: expect.any(Date),
        expiresAt: expect.any(Date),
      });
    });
  });

  describe("createMove", () => {
    it("should create a new move object", () => {
      const gameId = 1;
      const playerId = 2;
      const position = 3;
      const move = gameFactory.createMove(gameId, playerId, position);

      expect(move).toEqual({
        gameId: 1,
        playerId: 2,
        position: 3,
        symbol: null,
        timestamp: expect.any(Date),
      });
    });
  });
});
