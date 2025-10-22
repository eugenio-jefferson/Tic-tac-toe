const { Module } = require('@nestjs/common');
const { LogsService } = require('./logs.service');

@Module({
  providers: [LogsService],
  exports: [LogsService],
})
class LogsModule {}

module.exports = { LogsModule };