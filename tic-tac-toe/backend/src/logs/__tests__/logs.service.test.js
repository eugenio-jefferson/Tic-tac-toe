const { time } = require("console");
const { LogsService } = require("../logs.service");

describe("LogsService", () => {
  let logsService;
  let prismaService;

  beforeEach(() => {
    prismaService = {
      log: {
        create: jest.fn(),
      },
    };
    logsService = new LogsService(prismaService);
  });

  it("should be defined", () => {
    expect(logsService).toBeDefined();
  });

  describe("logEvent", () => {
    it("should call prisma.log.create with the correct parameters", async () => {
      const type = "EVENT";
      const eventType = "TEST_EVENT";
      const eventData = { key: "value" };
      
      await logsService.logEvent(eventType, eventData);
      expect(prismaService.log.create).toHaveBeenCalledWith({
        data: {
          type,
          eventType,
          data: JSON.stringify(eventData),
          timestamp: expect.any(Date),
        },
      });
    });
  });

  describe("logGameEvent", () => {
    it("should call prisma.log.create with the correct parameters", async () => {
      const type = "GAME_EVENT";
      const gameId = 1;
      const eventType = "TEST_GAME_EVENT";
      const eventData = { key: "value" };
      await logsService.logGameEvent(gameId, eventType, eventData);
      expect(prismaService.log.create).toHaveBeenCalledWith({
        data: {
          type,
          gameId,
          eventType,
          data: JSON.stringify(eventData),
          timestamp: expect.any(Date),
        },
      });
    });
  });
});
