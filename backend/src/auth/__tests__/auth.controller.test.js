const { AuthController } = require("../auth.controller");
const { AuthService } = require("../auth.service");
const { RegisterDto, LoginDto } = require("../dto/auth.dto");

describe("AuthController", () => {
  let authController;
  let authService;

  beforeEach(() => {
    authService = {
      register: jest.fn(),
      login: jest.fn(),
    };
    authController = new AuthController(authService);
  });

  describe("register", () => {
    it("should call authService.register with the provided DTO", async () => {
      const dto = new RegisterDto();
      await authController.register(dto);
      expect(authService.register).toHaveBeenCalledWith(dto);
    });
  });

  describe("login", () => {
    it("should call authService.login with the provided DTO", async () => {
      const dto = new LoginDto();
      await authController.login(dto);
      expect(authService.login).toHaveBeenCalledWith(dto);
    });
  });
});
