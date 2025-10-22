const { Module, Global } = require("@nestjs/common");
const { PrismaService } = require("./prisma.service");

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
class DatabaseModule {}

module.exports = { DatabaseModule };
