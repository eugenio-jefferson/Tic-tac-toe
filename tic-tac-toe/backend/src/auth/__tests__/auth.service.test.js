const { create } = require("domain");
const { AuthService } = require("../auth.service");
const bcrypt = require("bcrypt");

describe("AuthService", () => {
  let authService;
  let jwtService;
  let usersService;
  let logsService;

  beforeEach(() => {
    jwtService = {
      signAsync: jest.fn(),
    };
    usersService = {
      create: jest.fn(),
      findByUsername: jest.fn(),
      updateOnlineStatus: jest.fn(),
    };
    logsService = {
      logEvent: jest.fn(),
      logError: jest.fn(),
    };
    authService = new AuthService(usersService, jwtService, logsService);
  });

describe("register", () => {
    it("should call usersService.create and jwtService.signAsync", async () => {
      const dto = { username: "test", password: "password" };
      bcrypt.hash = jest.fn().mockResolvedValue("hashedPassword");
      usersService.create.mockResolvedValue({ id: 1, username: "test" });
      jwtService.signAsync.mockResolvedValue("token");

      const result = await authService.register(dto);

      expect(usersService.create).toHaveBeenCalledWith({username: "test", password: "hashedPassword"});
      expect(jwtService.signAsync).toHaveBeenCalled();
      expect(result).toEqual({
         access_token: "token",
         user: { id: 1, username: "test", createdAt: undefined },
        });
    });
  });

  describe("login", () => {
    it("should call usersService.findByUsername and jwtService.signAsync", async () => {
      const dto = { username: "test", password: "password" };
      usersService.findByUsername.mockResolvedValue({
        id: 1,
        username: "test",
        password: "hashedPassword",
      });
      bcrypt.compare = jest.fn().mockResolvedValue(true);
      jwtService.signAsync.mockResolvedValue("token");

      const result = await authService.login(dto);

      expect(usersService.findByUsername).toHaveBeenCalledWith(
        dto.username,
      );
      expect(jwtService.signAsync).toHaveBeenCalled();
      expect(result).toEqual({
         access_token: "token",
         user: { id: 1, username: "test", createdAt: undefined, isOnline: true },
        });
    });
  });
});
