const { UsersService } = require("../users.service");
const { PrismaService } = require("../../database/prisma.service");

describe("UsersService", () => {
  let usersService;
  let prismaService;

  beforeEach(() => {
    prismaService = {
      user: {
        findUnique: jest.fn(),
        findMany: jest.fn(),
        create: jest.fn(),
      },
    };
    usersService = new UsersService(prismaService);
  });

  it("should be defined", () => {
    expect(usersService).toBeDefined();
  });

  describe("findById", () => {
    it("should call prisma.user.findUnique with the correct id", async () => {
      const id = 1;
      await usersService.findById(id);
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id },
        select: {
          id: true,
          username: true,
          isOnline: true,
          createdAt: true,
          updatedAt: true,
      },
      });
    });
  });


  describe("createUser", () => {
    it("should call prisma.user.create with the provided data", async () => {
      const data = { username: "test", password: "password", isOnline: false };
      await usersService.create(data);
      expect(prismaService.user.create).toHaveBeenCalledWith({ data });
    });
  });
});
