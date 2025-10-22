const { Controller, Post, Body, UseGuards, Get, Inject } = require('@nestjs/common');
const { AuthService } = require('./auth.service');
const { JwtAuthGuard } = require('../common/guards');
const { GetUser } = require('../common/decorators');
const { RegisterDto, LoginDto } = require('./dto/auth.dto');

@Controller('auth')
class AuthController {
  constructor(@Inject(AuthService) authService) {
    this.authService = authService;
  }

  @Post('register')
  async register(@Body() registerDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  async login(@Body() loginDto) {
    return this.authService.login(loginDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@GetUser() user) {
    return this.authService.logout(user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@GetUser() user) {
    return {
      id: user.sub,
      username: user.username,
    };
  }
}

module.exports = { AuthController };

