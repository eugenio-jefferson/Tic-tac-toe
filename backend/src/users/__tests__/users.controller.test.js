const { UsersController } = require("../users.controller");
const { UsersService } = require("../users.service");

describe("UsersController", () => {
  let usersController;
  let usersService;

  beforeEach(() => {
    usersService = {
      findOnlineUsers: jest.fn(),
      getUserStats: jest.fn(),
    };
    usersController = new UsersController(usersService);
  });

  it("should be defined", () => {
    expect(usersController).toBeDefined();
  });

  describe("getOnlineUsers", () => {
    it("should call usersService.getOnlineUsers", async () => {
      await usersController.getOnlineUsers();
      expect(usersService.findOnlineUsers).toHaveBeenCalled();
    });
  });

  describe("getUserStats", () => {
    it("should call usersService.getUserStats with the correct id", async () => {
      const id = "1";
      await usersController.getUserStats(id);
      expect(usersService.getUserStats).toHaveBeenCalledWith(1);
    });
  });
});
