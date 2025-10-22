const { Module, forwardRef } = require("@nestjs/common");
const { EventsGateway } = require("./events.gateway");
const { EventBusService } = require("./event-bus.service");
const { UsersModule } = require("../users/users.module");
const { LogsModule } = require("../logs/logs.module");
const { AuthModule } = require("../auth/auth.module");

@Module({
  imports: [
    forwardRef(() => require("../games/games.module").GamesModule),
    UsersModule,
    LogsModule,
    AuthModule,
  ],
  providers: [EventsGateway, EventBusService],
  exports: [EventBusService],
})
class EventsModule {}

module.exports = { EventsModule };
