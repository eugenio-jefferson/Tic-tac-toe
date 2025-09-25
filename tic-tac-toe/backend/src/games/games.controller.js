const { Controller, Get, Post, Put, Body, Param, UseGuards, Query, Inject } = require('@nestjs/common');
const { GamesService } = require('./games.service');
const { JwtAuthGuard } = require('../common/guards');
const { GetUser } = require('../common/decorators');

@Controller('games')
@UseGuards(JwtAuthGuard)
class GamesController {
  constructor(@Inject(GamesService)gamesService) {
    this.gamesService = gamesService;
  }

  @Post('invitations')
  async createInvitation(@GetUser() user, @Body() body) {
    return this.gamesService.createInvitation(user.sub, body.toUserId);
  }

  @Put('invitations/:id/accept')
  async acceptInvitation(@GetUser() user, @Param('id') id) {
    return this.gamesService.acceptInvitation(parseInt(id), user.sub);
  }

  @Put('invitations/:id/reject')
  async rejectInvitation(@GetUser() user, @Param('id') id) {
    return this.gamesService.rejectInvitation(parseInt(id), user.sub);
  }

  @Get('invitations/pending')
  async getPendingInvitations(@GetUser() user) {
    return this.gamesService.getPendingInvitations(user.sub);
  }

  @Get('invitations/sent')
  async getSentInvitations(@GetUser() user) {
    return this.gamesService.getSentInvitations(user.sub);
  }

  @Post(':id/moves')
  async makeMove(@GetUser() user, @Param('id') id, @Body() body) {
    return this.gamesService.makeMove(parseInt(id), user.sub, body.position);
  }

  @Put(':id/abandon')
  async abandonGame(@GetUser() user, @Param('id') id) {
    return this.gamesService.abandonGame(parseInt(id), user.sub);
  }

  @Get(':id')
  async getGame(@GetUser() user, @Param('id') id) {
    return this.gamesService.getGame(parseInt(id), user.sub);
  }

  @Get()
  async getUserGames(@GetUser() user, @Query('status') status) {
    return this.gamesService.getUserGames(user.sub, status);
  }
}

module.exports = { GamesController };

