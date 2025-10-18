const { JwtStrategy } = require("../jwt.strategy");

describe("JwtStrategy", () => {
  let jwtStrategy;
  let authService;

  beforeEach(() => {
    authService = {
      validateUser: jest.fn(),
    };
    jwtStrategy = new JwtStrategy(authService);
  });

  describe("validate", () => {
    it("should call authService.validateUser with the provided payload", async () => {
      const payload = { sub: 1 };
      authService.validateUser.mockResolvedValue({ id: 1, username: "test" });

      const result = await jwtStrategy.validate(payload);

      expect(authService.validateUser).toHaveBeenCalledWith(payload);
      expect(result).toEqual({ id: 1, username: "test" });
    });

    it("should return null if user is not found", async () => {
      const payload = { sub: 1 };
      authService.validateUser.mockResolvedValue(null);

      const result = await jwtStrategy.validate(payload);

      expect(authService.validateUser).toHaveBeenCalledWith(payload);
      expect(result).toBeNull();
    });
  });
});
