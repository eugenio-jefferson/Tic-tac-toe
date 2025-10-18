const { NestFactory } = require("@nestjs/core");
const { AppModule } = require("../app.module");

const appMock = {
  enableCors: jest.fn(),
  setGlobalPrefix: jest.fn(),
  listen: jest.fn(),
};

jest.mock("@nestjs/core", () => ({
  NestFactory: {
    create: jest.fn().mockReturnValue({
      enableCors: jest.fn(),
      setGlobalPrefix: jest.fn(),
      listen: jest.fn(),
    }),
  },
}));

describe("Main", () => {
  it("should create and initialize the app", async () => {
    const mockNestFactory = NestFactory;
    const mockCreate = jest.fn().mockResolvedValue(appMock);
    mockNestFactory.create = mockCreate;

    await require("../main");

    expect(mockCreate).toHaveBeenCalledWith(AppModule);
    expect(appMock.enableCors).toHaveBeenCalledWith({
      origin: process.env.CORS_ORIGIN || "http://localhost:3000",
      credentials: true,
    });
    expect(appMock.setGlobalPrefix).toHaveBeenCalledWith("api");
    expect(appMock.listen).toHaveBeenCalled();
  });
});
