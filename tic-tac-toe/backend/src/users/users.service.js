const { Injectable, Inject } = require("@nestjs/common");
const { PrismaService } = require("../database/prisma.service");

@Injectable()
class UsersService {
  constructor(@Inject(PrismaService)prisma) {
    this.prisma = prisma;
  }

  async create(createUserDto) {
    return this.prisma.user.create({
      data: {
        username: createUserDto.username,
        password: createUserDto.password,
        isOnline: false,
      },
    });
  }

  async findById(id) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        isOnline: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findByUsername(username) {
    return this.prisma.user.findUnique({
      where: { username },
    });
  }

  async findOnlineUsers() {
    return this.prisma.user.findMany({
      where: { isOnline: true },
      select: {
        id: true,
        username: true,
        isOnline: true,
      },
    });
  }

  async updateOnlineStatus(id, isOnline) {
    return this.prisma.user.update({
      where: { id },
      data: { isOnline },
    });
  }

  async getUserStats(id) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        gamesAsPlayer1: {
          select: {
            id: true,
            status: true,
            winner: true,
          },
        },
        gamesAsPlayer2: {
          select: {
            id: true,
            status: true,
            winner: true,
          },
        },
      },
    });

    if (!user) {
      return null;
    }

    const allGames = [...user.gamesAsPlayer1, ...user.gamesAsPlayer2];
    const completedGames = allGames.filter(
      (game) => game.status === "FINISHED"
    );
    const wins = completedGames.filter((game) => game.winner === id).length;
    const losses = completedGames.filter(
      (game) => game.winner && game.winner !== id
    ).length;
    const draws = completedGames.filter((game) => !game.winner).length;

    return {
      id: user.id,
      username: user.username,
      isOnline: user.isOnline,
      stats: {
        totalGames: completedGames.length,
        wins,
        losses,
        draws,
        winRate:
          completedGames.length > 0
            ? ((wins / completedGames.length) * 100).toFixed(2)
            : 0,
      },
    };
  }

  async getLeaderboard() {
    const users = await this.prisma.user.findMany({
      include: {
        gamesAsPlayer1: {
          where: { status: "FINISHED" },
          select: { winner: true },
        },
        gamesAsPlayer2: {
          where: { status: "FINISHED" },
          select: { winner: true },
        },
      },
    });

    const leaderboard = users.map((user) => {
      const allGames = [...user.gamesAsPlayer1, ...user.gamesAsPlayer2];
      const wins = allGames.filter((game) => game.winner === user.id).length;
      const losses = allGames.filter(
        (game) => game.winner && game.winner !== user.id
      ).length;
      const draws = allGames.filter((game) => !game.winner).length;
      const totalGames = allGames.length;

      return {
        id: user.id,
        username: user.username,
        isOnline: user.isOnline,
        stats: {
          totalGames,
          wins,
          losses,
          draws,
          winRate: totalGames > 0 ? ((wins / totalGames) * 100).toFixed(2) : 0,
        },
      };
    });

    return leaderboard.sort((a, b) => {
      if (b.stats.wins !== a.stats.wins) {
        return b.stats.wins - a.stats.wins;
      }
      return parseFloat(b.stats.winRate) - parseFloat(a.stats.winRate);
    });
  }
}

module.exports = { UsersService };
