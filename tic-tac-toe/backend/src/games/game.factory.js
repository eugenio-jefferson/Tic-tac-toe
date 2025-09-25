const { Injectable } = require('@nestjs/common');

@Injectable()
class GameFactory {
  createGame(player1Id, player2Id) {
    return {
      player1Id,
      player2Id,
      board: Array(9).fill(null), 
      currentPlayer: player1Id, 
      status: 'WAITING', 
      winner: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  createGameInvitation(fromUserId, toUserId) {
    return {
      fromUserId,
      toUserId,
      status: 'PENDING', 
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), 
    };
  }

  createMove(gameId, playerId, position) {
    return {
      gameId,
      playerId,
      position, 
      symbol: null, 
      timestamp: new Date(),
    };
  }
}

module.exports = { GameFactory };

