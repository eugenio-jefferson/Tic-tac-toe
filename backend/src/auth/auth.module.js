const { Module } = require('@nestjs/common');
const { JwtModule } = require('@nestjs/jwt');
const { PassportModule } = require('@nestjs/passport');
const { AuthController } = require('./auth.controller');
const { AuthService } = require('./auth.service');
const { JwtStrategy } = require('./jwt.strategy');
const { UsersModule } = require('../users/users.module');
const { LogsModule } = require('../logs/logs.module'); 

@Module({
  imports: [
    UsersModule,
    LogsModule, 
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-here',
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN || '24h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService, JwtModule],
})
class AuthModule {}

module.exports = { AuthModule };