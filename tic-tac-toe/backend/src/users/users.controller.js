const { Controller, Get, UseGuards, Param, Inject } = require('@nestjs/common');
const { UsersService } = require('./users.service');
const { JwtAuthGuard } = require('../common/guards');
const { GetUser } = require('../common/decorators');

@Controller('users')
@UseGuards(JwtAuthGuard)
class UsersController {
  constructor(@Inject(UsersService)usersService) {
    this.usersService = usersService;
  }

  @Get('online')
  async getOnlineUsers() {
    return this.usersService.findOnlineUsers();
  }

  @Get('profile')
  async getProfile(@GetUser() user) {
    return this.usersService.findById(user.sub);
  }

  @Get('stats/:id')
  async getUserStats(@Param('id') id) {
    return this.usersService.getUserStats(parseInt(id));
  }

  @Get('leaderboard')
  async getLeaderboard() {
    return this.usersService.getLeaderboard();
  }
}

module.exports = { UsersController };

