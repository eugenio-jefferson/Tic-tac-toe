const { PrismaService } = require("../prisma.service");

describe("PrismaService", () => {
  let prismaService;

  beforeEach(() => {
    prismaService = new PrismaService();
  });

  it("should be defined", () => {
    expect(prismaService).toBeDefined();
  });

  it("should connect to the database on init", async () => {
    prismaService.$connect = jest.fn();
    await prismaService.onModuleInit();
    expect(prismaService.$connect).toHaveBeenCalled();
  });

  it("should disconnect from the database on destroy", async () => {
    prismaService.$disconnect = jest.fn();
    await prismaService.onModuleDestroy();
    expect(prismaService.$disconnect).toHaveBeenCalled();
  });
});