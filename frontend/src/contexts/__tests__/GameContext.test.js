import React from 'react';
import { render, screen, act, waitFor } from '@testing-library/react';
import { GameProvider, useGame } from '../GameContext';
import { useAuth } from '../AuthContext';
import { socketClient } from '@/lib/socket';
import { apiClient } from '@/lib/api';

jest.mock('../AuthContext', () => ({
  useAuth: jest.fn(),
}));

jest.mock('@/lib/api', () => ({
  apiClient: {
    getOnlineUsers: jest.fn(),
    getPendingInvitations: jest.fn(),
    getSentInvitations: jest.fn(),
    getUserGames: jest.fn(),
    createInvitation: jest.fn(),
    acceptInvitation: jest.fn(),
    rejectInvitation: jest.fn(),
  },
}));

jest.mock('@/lib/socket', () => ({
  socketClient: {
    socket: {
      on: jest.fn(),
      off: jest.fn(),
    },
    connect: jest.fn(),
    disconnect: jest.fn(),
    makeMove: jest.fn(),
    abandonGame: jest.fn(),
  },
}));

const mockUser = { id: 'user1', username: 'TestUser' };
const mockOnlineUsers = [{ id: 'user2', username: 'Opponent', isOnline: true }];
const mockPendingInvitations = [{ id: 'inv1', fromUser: { username: 'Inviter' }, fromUserId: 'user2', toUserId: 'user1', createdAt: new Date().toISOString() }];
const mockSentInvitations = [{ id: 'inv2', toUser: { username: 'Invited' }, fromUserId: 'user1', toUserId: 'user3', createdAt: new Date().toISOString() }];
const mockGameHistory = [{ id: 'game1', status: 'FINISHED', player1Id: 'user1', player2Id: 'user2' }];
const mockCurrentGame = {
  id: 'game2',
  status: 'IN_PROGRESS',
  player1Id: 'user1',
  player2Id: 'user2',
  currentPlayer: 'user1',
  board: Array(9).fill(null),
  player1: { username: 'TestUser' },
  player2: { username: 'Opponent' },
};

let contextValue;
const TestComponent = () => {
  contextValue = useGame(); 
  return (
    <div>
      <span data-testid="online-users-count">{contextValue.onlineUsers.length}</span>
      <span data-testid="pending-invitations-count">{contextValue.pendingInvitations.length}</span>
      <span data-testid="sent-invitations-count">{contextValue.sentInvitations.length}</span>
      <span data-testid="current-game-id">{contextValue.currentGame ? contextValue.currentGame.id : 'null'}</span>
      <span data-testid="game-history-count">{contextValue.gameHistory.length}</span>
      <button onClick={() => contextValue.inviteUser('user2')} data-testid="invite-button">Invite</button>
      <button onClick={() => contextValue.acceptInvitation('inv1')} data-testid="accept-button">Accept</button>
      <button onClick={() => contextValue.rejectInvitation('inv1')} data-testid="reject-button">Reject</button>
    </div>
  );
};

describe('GameContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAuth.mockReturnValue({ user: mockUser, isAuthenticated: true });

    apiClient.getOnlineUsers.mockResolvedValue(mockOnlineUsers);
    apiClient.getPendingInvitations.mockResolvedValue(mockPendingInvitations);
    apiClient.getSentInvitations.mockResolvedValue(mockSentInvitations);
    apiClient.getUserGames.mockResolvedValue(mockGameHistory);

    socketClient.socket._handlers = {};
    socketClient.socket.on.mockImplementation((event, handler) => {
      socketClient.socket._handlers[event] = handler;
    });
    socketClient.socket.off.mockImplementation((event) => {
      delete socketClient.socket._handlers[event];
    });
  });

  const simulateSocketEvent = (event, data) => {
    if (socketClient.socket._handlers && socketClient.socket._handlers[event]) {
      act(() => {
        socketClient.socket._handlers[event](data);
      });
    }
  };
  
  it('should handle game:move:made socket event', async () => {
    apiClient.getUserGames.mockResolvedValue([
      { ...mockCurrentGame, id: 'gameMove', status: 'IN_PROGRESS', player1Id: 'user1', player2Id: 'user2', board: Array(9).fill(null) }
    ]);

    render(
      <GameProvider>
        <TestComponent />
      </GameProvider>
    );
    await waitFor(() => expect(screen.getByTestId('current-game-id')).toHaveTextContent('gameMove'));

    const updatedGame = { ...mockCurrentGame, id: 'gameMove', board: ['X', null, null, null, null, null, null, null, null] };
    simulateSocketEvent('game:move:made', { game: updatedGame });

    await waitFor(() => {
      expect(contextValue.currentGame.board[0]).toBe('X');
    });
  });
  
  it('should call inviteUser API and update sentInvitations', async () => {
    apiClient.createInvitation.mockResolvedValue({ id: 'invNew', toUser: { username: 'NewInvited' }, fromUserId: 'user1', toUserId: 'user2', createdAt: new Date().toISOString() });
  
    render(
      <GameProvider>
        <TestComponent />
      </GameProvider>
    );
    await waitFor(() => expect(screen.getByTestId('sent-invitations-count')).toHaveTextContent('1'));
  
    await act(async () => {
      screen.getByTestId('invite-button').click();
    });
  
    await waitFor(() => {
      expect(apiClient.createInvitation).toHaveBeenCalledWith('user2');
      expect(screen.getByTestId('sent-invitations-count')).toHaveTextContent('2');
    });
  });
  
  it('should call acceptInvitation API and update pendingInvitations and currentGame', async () => {
    apiClient.acceptInvitation.mockResolvedValue(mockCurrentGame);

    render(
      <GameProvider>
        <TestComponent />
      </GameProvider>
    );
    await waitFor(() => expect(screen.getByTestId('pending-invitations-count')).toHaveTextContent('1'));

    await act(async () => {
      screen.getByTestId('accept-button').click();
    });

    await waitFor(() => {
      expect(apiClient.acceptInvitation).toHaveBeenCalledWith('inv1');
      expect(screen.getByTestId('pending-invitations-count')).toHaveTextContent('0');
      expect(screen.getByTestId('current-game-id')).toHaveTextContent(mockCurrentGame.id);
    });
  });

  it('should call rejectInvitation API and update pendingInvitations', async () => {
    apiClient.rejectInvitation.mockResolvedValue({});

    render(
      <GameProvider>
        <TestComponent />
      </GameProvider>
    );
    await waitFor(() => expect(screen.getByTestId('pending-invitations-count')).toHaveTextContent('1'));

    await act(async () => {
      screen.getByTestId('reject-button').click();
    });

    await waitFor(() => {
      expect(apiClient.rejectInvitation).toHaveBeenCalledWith('inv1');
      expect(screen.getByTestId('pending-invitations-count')).toHaveTextContent('0');
    });
  });
});