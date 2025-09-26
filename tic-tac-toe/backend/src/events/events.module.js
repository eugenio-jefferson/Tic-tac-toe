const { Module } = require('@nestjs/common');
const { EventsGateway } = require('./events.gateway');
const { EventBusService } = require('./event-bus.service');
const { GamesModule } = require('../games/games.module');
const { UsersModule } = require('../users/users.module');
const { LogsModule } = require('../logs/logs.module');
const { AuthModule } = require('../auth/auth.module');

@Module({
  imports: [GamesModule, UsersModule, LogsModule, AuthModule],
  providers: [EventsGateway, EventBusService],
  exports: [EventBusService],
})
class EventsModule {}

module.exports = { EventsModule };

