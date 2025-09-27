const { GameLogicService } = require("../game-logic.service");

describe("GameLogicService", () => {
  let service;

  beforeEach(() => {
    service = new GameLogicService();
  });

  describe("isValidMove", () => {
    it("should return true for a valid move", () => {
      const board = [null, null, null, null, null, null, null, null, null];
      expect(service.isValidMove(board, 0)).toBe(true);
    });

    it("should return false for an invalid move (position out of bounds)", () => {
      const board = [null, null, null, null, null, null, null, null, null];
      expect(service.isValidMove(board, -1)).toBe(false);
      expect(service.isValidMove(board, 9)).toBe(false);
    });

    it("should return false for an invalid move (position already taken)", () => {
      const board = ["X", null, null, null, null, null, null, null, null];
      expect(service.isValidMove(board, 0)).toBe(false);
    });
  });

  describe("makeMove", () => {
    it("should make a move on the board", () => {
      const board = [null, null, null, null, null, null, null, null, null];
      const newBoard = service.makeMove(board, 0, "X");
      expect(newBoard[0]).toBe("X");
    });

    it("should throw an error for an invalid move", () => {
      const board = ["X", null, null, null, null, null, null, null, null];
      expect(() => service.makeMove(board, 0, "X")).toThrow("Invalid move");
    });
  });

  describe("getPlayerSymbol", () => {
    it("should return the correct symbol for player 1", () => {
      const game = { player1Id: 1, player2Id: 2 };
      expect(service.getPlayerSymbol(game, 1)).toBe("X");
    });

    it("should return the correct symbol for player 2", () => {
      const game = { player1Id: 1, player2Id: 2 };
      expect(service.getPlayerSymbol(game, 2)).toBe("O");
    });
  });

  describe("isPlayerTurn", () => {
    it("should return true if it is the player's turn", () => {
      const game = { currentPlayer: 1 };
      expect(service.isPlayerTurn(game, 1)).toBe(true);
    });

    it("should return false if it is not the player's turn", () => {
      const game = { currentPlayer: 1 };
      expect(service.isPlayerTurn(game, 2)).toBe(false);
    });
  });

  describe("getNextPlayer", () => {
    it("should return the next player", () => {
      const game = { currentPlayer: 1, player1Id: 1, player2Id: 2 };
      expect(service.getNextPlayer(game)).toBe(2);
      game.currentPlayer = 2;
      expect(service.getNextPlayer(game)).toBe(1);
    });
  });

  describe("checkWinner", () => {
    it("should return the winner and winning combination if there is a winner", () => {
      const board = ["X", "X", "X", null, null, null, null, null, null];
      const result = service.checkWinner(board);
      expect(result).toEqual({ winner: "X", winningCombination: [0, 1, 2] });
    });

    it("should return null if there is no winner", () => {
      const board = ["X", "O", "X", null, null, null, null, null, null];
      expect(service.checkWinner(board)).toBeNull();
    });
  });

  describe("isBoardFull", () => {
    it("should return true if the board is full", () => {
      const board = ["X", "O", "X", "O", "X", "O", "O", "X", "O"];
      expect(service.isBoardFull(board)).toBe(true);
    });

    it("should return false if the board is not full", () => {
      const board = ["X", "O", "X", "O", "X", "O", "O", "X", null];
      expect(service.isBoardFull(board)).toBe(false);
    });
  });

  describe("getGameStatus", () => {
    it("should return FINISHED status with winner if there is a winner", () => {
      const board = ["X", "X", "X", null, null, null, null, null, null];
      const result = service.getGameStatus(board);
      expect(result).toEqual({
        status: "FINISHED",
        winner: "X",
        winningCombination: [0, 1, 2],
        isDraw: false,
      });
    });

    it("should return FINISHED status with draw if the board is full and no winner", () => {
      const board = ["X", "O", "X", "O", "X", "O", "O", "X", "O"];
      const result = service.getGameStatus(board);
      expect(result).toEqual({
        status: "FINISHED",
        winner: null,
        winningCombination: null,
        isDraw: true,
      });
    });

    it("should return IN_PROGRESS status if the game is not finished", () => {
      const board = [null, null, null, null, null, null, null, null, null];
      const result = service.getGameStatus(board);
      expect(result).toEqual({
        status: "IN_PROGRESS",
        winner: null,
        winningCombination: null,
        isDraw: false,
      });
    });
  });

  describe("positionToCoordinates", () => {
    it("should return the correct coordinates for a given position", () => {
      expect(service.positionToCoordinates(0)).toEqual({ row: 0, col: 0 });
      expect(service.positionToCoordinates(4)).toEqual({ row: 1, col: 1 });
      expect(service.positionToCoordinates(8)).toEqual({ row: 2, col: 2 });
    });
  });

  describe("coordinatesToPosition", () => {
    it("should return the correct position for given coordinates", () => {
      expect(service.coordinatesToPosition(0, 0)).toBe(0);
      expect(service.coordinatesToPosition(1, 1)).toBe(4);
      expect(service.coordinatesToPosition(2, 2)).toBe(8);
    });
  });

  describe("getAvailableMoves", () => {
    it("should return an array of available moves", () => {
      const board = ["X", "O", "X", "O", "X", "O", "O", "X", null];
      expect(service.getAvailableMoves(board)).toEqual([8]);
    });

    it("should return an empty array if the board is full", () => {
      const board = ["X", "O", "X", "O", "X", "O", "O", "X", "O"];
      expect(service.getAvailableMoves(board)).toEqual([]);
    });
  });

  describe("validateGameState", () => {
    it("should return isValid true if the game state is valid", () => {
      const game = {
        board: Array(9).fill(null),
        player1Id: 1,
        player2Id: 2,
        status: "WAITING",
      };
      expect(service.validateGameState(game).isValid).toBe(true);
    });

    it("should return isValid false if the board size is invalid", () => {
      const game = {
        board: Array(8).fill(null),
        player1Id: 1,
        player2Id: 2,
        status: "WAITING",
      };
      expect(service.validateGameState(game).isValid).toBe(false);
    });

    it("should return isValid false if players are missing", () => {
      const game = {
        board: Array(9).fill(null),
        player1Id: null,
        player2Id: 2,
        status: "WAITING",
      };
      expect(service.validateGameState(game).isValid).toBe(false);
    });

    it("should return isValid false if players are the same", () => {
      const game = {
        board: Array(9).fill(null),
        player1Id: 1,
        player2Id: 1,
        status: "WAITING",
      };
      expect(service.validateGameState(game).isValid).toBe(false);
    });

    it("should return isValid false if the game status is invalid", () => {
      const game = {
        board: Array(9).fill(null),
        player1Id: 1,
        player2Id: 2,
        status: "INVALID",
      };
      expect(service.validateGameState(game).isValid).toBe(false);
    });
  });
});
