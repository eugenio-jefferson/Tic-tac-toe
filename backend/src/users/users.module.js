const { Module } = require('@nestjs/common');
const { UsersController } = require('./users.controller');
const { UsersService } = require('./users.service');
const { DatabaseModule } = require('../database/database.module');
const { JwtModule } = require('@nestjs/jwt');

@Module({
  imports: [
    DatabaseModule,
    JwtModule.register({ 
      secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-here',
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN || '24h' },
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
class UsersModule {}

module.exports = { UsersModule };

