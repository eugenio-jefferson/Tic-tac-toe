const { Module, forwardRef } = require("@nestjs/common");
const { GamesController } = require("./games.controller");
const { GamesService } = require("./games.service");
const { GameLogicService } = require("./game-logic.service");
const { GameFactory } = require("./game.factory");
const { LogsModule } = require("../logs/logs.module");
const { AuthModule } = require("../auth/auth.module");

@Module({
  imports: [
    LogsModule,
    AuthModule,
    forwardRef(() => require("../events/events.module").EventsModule),
  ],
  controllers: [GamesController],
  providers: [GamesService, GameLogicService, GameFactory],
  exports: [GamesService, GameLogicService, GameFactory],
})
class GamesModule {}

module.exports = { GamesModule };
