const { GamesController } = require("../games.controller");
const { GamesService } = require("../games.service");

describe("GamesController", () => {
  let gamesController;
  let gamesService;

  beforeEach(() => {
    gamesService = {
      createInvitation: jest.fn(),
      acceptInvitation: jest.fn(),
      rejectInvitation: jest.fn(),
      getPendingInvitations: jest.fn(),
      getSentInvitations: jest.fn(),
      makeMove: jest.fn(),
      abandonGame: jest.fn(),
      getGame: jest.fn(),
      getUserGames: jest.fn(),
    };
    gamesController = new GamesController(gamesService);
  });

  it("should be defined", () => {
    expect(gamesController).toBeDefined();
  });

  describe("createInvitation", () => {
    it("should call gamesService.createInvitation with the correct parameters", async () => {
      const user = { sub: 1 };
      const body = { toUserId: 2 };
      await gamesController.createInvitation(user, body);
      expect(gamesService.createInvitation).toHaveBeenCalledWith(
        user.sub,
        body.toUserId,
      );
    });
  });

  describe("acceptInvitation", () => {
    it("should call gamesService.acceptInvitation with the correct parameters", async () => {
      const user = { sub: 1 };
      const id = "2";
      await gamesController.acceptInvitation(user, id);
      expect(gamesService.acceptInvitation).toHaveBeenCalledWith(2, user.sub);
    });
  });

  describe("rejectInvitation", () => {
    it("should call gamesService.rejectInvitation with the correct parameters", async () => {
      const user = { sub: 1 };
      const id = "2";
      await gamesController.rejectInvitation(user, id);
      expect(gamesService.rejectInvitation).toHaveBeenCalledWith(2, user.sub);
    });
  });

  describe("getPendingInvitations", () => {
    it("should call gamesService.getPendingInvitations with the correct parameters", async () => {
      const user = { sub: 1 };
      await gamesController.getPendingInvitations(user);
      expect(gamesService.getPendingInvitations).toHaveBeenCalledWith(user.sub);
    });
  });

  describe("getSentInvitations", () => {
    it("should call gamesService.getSentInvitations with the correct parameters", async () => {
      const user = { sub: 1 };
      await gamesController.getSentInvitations(user);
      expect(gamesService.getSentInvitations).toHaveBeenCalledWith(user.sub);
    });
  });

  describe("makeMove", () => {
    it("should call gamesService.makeMove with the correct parameters", async () => {
      const user = { sub: 1 };
      const id = "2";
      const body = { position: 3 };
      await gamesController.makeMove(user, id, body);
      expect(gamesService.makeMove).toHaveBeenCalledWith(
        2,
        user.sub,
        body.position,
      );
    });
  });

  describe("abandonGame", () => {
    it("should call gamesService.abandonGame with the correct parameters", async () => {
      const user = { sub: 1 };
      const id = "2";
      await gamesController.abandonGame(user, id);
      expect(gamesService.abandonGame).toHaveBeenCalledWith(2, user.sub);
    });
  });

  describe("getGame", () => {
    it("should call gamesService.getGame with the correct parameters", async () => {
      const user = { sub: 1 };
      const id = "2";
      await gamesController.getGame(user, id);
      expect(gamesService.getGame).toHaveBeenCalledWith(2, user.sub);
    });
  });

  describe("getUserGames", () => {
    it("should call gamesService.getUserGames with the correct parameters", async () => {
      const user = { sub: 1 };
      const query = { status: "IN_PROGRESS" };
      await gamesController.getUserGames(user, query.status);
      expect(gamesService.getUserGames).toHaveBeenCalledWith(
        user.sub,
        "IN_PROGRESS",
      );
    });
  });
});
