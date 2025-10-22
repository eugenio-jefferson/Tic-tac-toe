const { Injectable, Logger, Inject } = require("@nestjs/common");
const { PrismaService } = require("../database/prisma.service");

@Injectable()
class LogsService {
  constructor(@Inject(PrismaService) prisma) {
    this.prisma = prisma;
    this.logger = new Logger(LogsService.name);
  }

  async logEvent(eventType, data = {}) {
    try {
      const logEntry = await this.prisma.log.create({
        data: {
          type: "EVENT",
          eventType,
          data: JSON.stringify(data),
          timestamp: new Date(),
        },
      });

      this.logger.log(`Event logged: ${eventType}`, data);
      return logEntry;
    } catch (error) {
      this.logger.error(`Failed to log event: ${eventType}`, error);
    }
  }

  async logError(errorType, message, data = {}) {
    try {
      const logEntry = await this.prisma.log.create({
        data: {
          type: "ERROR",
          eventType: errorType,
          message,
          data: JSON.stringify(data),
          timestamp: new Date(),
        },
      });

      this.logger.error(`Error logged: ${errorType} - ${message}`, data);
      return logEntry;
    } catch (error) {
      this.logger.error(`Failed to log error: ${errorType}`, error);
    }
  }

  async logGameEvent(gameId, eventType, data = {}) {
    try {
      const logEntry = await this.prisma.log.create({
        data: {
          type: "GAME_EVENT",
          eventType,
          gameId,
          data: JSON.stringify(data),
          timestamp: new Date(),
        },
      });

      this.logger.log(
        `Game event logged: ${eventType} for game ${gameId}`,
        data
      );
      return logEntry;
    } catch (error) {
      this.logger.error(`Failed to log game event: ${eventType}`, error);
    }
  }

  async getLogsByType(type, limit = 100) {
    return this.prisma.log.findMany({
      where: { type },
      orderBy: { timestamp: "desc" },
      take: limit,
    });
  }

  async getLogsByGame(gameId, limit = 100) {
    return this.prisma.log.findMany({
      where: { gameId },
      orderBy: { timestamp: "desc" },
      take: limit,
    });
  }

  async getRecentLogs(limit = 100) {
    return this.prisma.log.findMany({
      orderBy: { timestamp: "desc" },
      take: limit,
    });
  }
}

module.exports = { LogsService };
