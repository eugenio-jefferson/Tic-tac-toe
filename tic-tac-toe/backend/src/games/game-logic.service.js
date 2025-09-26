const { Injectable } = require('@nestjs/common');

@Injectable()
class GameLogicService {
  isValidMove(board, position) {
    return position >= 0 && position <= 8 && board[position] === null;
  }

  makeMove(board, position, symbol) {
    if (!this.isValidMove(board, position)) {
      throw new Error('Invalid move');
    }
    
    const newBoard = [...board];
    newBoard[position] = symbol;
    return newBoard;
  }

  getPlayerSymbol(game, playerId) {
    return game.player1Id === playerId ? 'X' : 'O';
  }

  isPlayerTurn(game, playerId) {
    return game.currentPlayer === playerId;
  }

  getNextPlayer(game) {
    return game.currentPlayer === game.player1Id ? game.player2Id : game.player1Id;
  }

  checkWinner(board) {
    const winningCombinations = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8], 
      [0, 4, 8], [2, 4, 6] 
    ];

    for (const combination of winningCombinations) {
      const [a, b, c] = combination;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return {
          winner: board[a],
          winningCombination: combination
        };
      }
    }

    return null;
  }

  isBoardFull(board) {
    return board.every(cell => cell !== null);
  }

  getGameStatus(board) {
    const winnerResult = this.checkWinner(board);
    
    if (winnerResult) {
      return {
        status: 'FINISHED',
        winner: winnerResult.winner,
        winningCombination: winnerResult.winningCombination,
        isDraw: false
      };
    }
    
    if (this.isBoardFull(board)) {
      return {
        status: 'FINISHED',
        winner: null,
        winningCombination: null,
        isDraw: true
      };
    }
    
    return {
      status: 'IN_PROGRESS',
      winner: null,
      winningCombination: null,
      isDraw: false
    };
  }

  positionToCoordinates(position) {
    return {
      row: Math.floor(position / 3),
      col: position % 3
    };
  }

  coordinatesToPosition(row, col) {
    return row * 3 + col;
  }

  getAvailableMoves(board) {
    return board
      .map((cell, index) => cell === null ? index : null)
      .filter(position => position !== null);
  }

  validateGameState(game) {
    const errors = [];

    if (!game.board || game.board.length !== 9) {
      errors.push('Invalid board size');
    }

    if (!game.player1Id || !game.player2Id) {
      errors.push('Missing players');
    }

    if (game.player1Id === game.player2Id) {
      errors.push('Players cannot be the same');
    }

    if (!['WAITING', 'IN_PROGRESS', 'FINISHED', 'ABANDONED'].includes(game.status)) {
      errors.push('Invalid game status');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

module.exports = { GameLogicService };

