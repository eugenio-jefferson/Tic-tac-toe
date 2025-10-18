const { Module } = require('@nestjs/common');
const { AuthModule } = require('./auth/auth.module');
const { UsersModule } = require('./users/users.module');
const { GamesModule } = require('./games/games.module');
const { EventsModule } = require('./events/events.module');
const { DatabaseModule } = require('./database/database.module');
const { LogsModule } = require('./logs/logs.module');

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    UsersModule,
    GamesModule,
    EventsModule,
    LogsModule,
  ],
})
class AppModule {}

module.exports = { AppModule };

