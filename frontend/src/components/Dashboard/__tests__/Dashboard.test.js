import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Dashboard from '../Dashboard';
import { useAuth } from '@/contexts/AuthContext';
import { useGame } from '@/contexts/GameContext';
import Lobby from '../../Lobby/Lobby';
import GameBoard from '../../GameBoard/GameBoard';
import Leaderboard from '../../Leaderboard/Leaderboard';
import '@testing-library/jest-dom';

jest.mock('@/contexts/AuthContext');
jest.mock('@/contexts/GameContext');

jest.mock('@/components/Lobby/Lobby', () => {
  const Lobby = () => <div data-testid="lobby-component">Lobby</div>;
  Lobby.displayName = 'Lobby';
  return Lobby;
});
jest.mock('@/components/GameBoard/GameBoard', () => {
  const GameBoard = () => <div data-testid="gameboard-component">GameBoard</div>;
  GameBoard.displayName = 'GameBoard';
  return GameBoard;
});
jest.mock('@/components/Leaderboard/Leaderboard', () => {
  const Leaderboard = () => <div data-testid="leaderboard-component">Leaderboard</div>;
  Leaderboard.displayName = 'Leaderboard';
  return Leaderboard;
});


describe('Dashboard', () => {
  const mockLogout = jest.fn();
  const mockUser = { username: 'TestUser' };

  beforeEach(() => {
    jest.clearAllMocks();
    useAuth.mockReturnValue({ user: mockUser, logout: mockLogout });
    useGame.mockReturnValue({ currentGame: null }); 
  });
  
  
  it('should switch to Leaderboard tab when clicked', () => {
    render(<Dashboard />);
    fireEvent.click(screen.getByRole('button', { name: /ranking/i }));
    expect(screen.getByRole('button', { name: /ranking/i })).toHaveStyle('border-color: #4f46e5');
    expect(screen.getByTestId('leaderboard-component')).toBeInTheDocument();
  });

  it('should call logout when "Sair" button is clicked', () => {
    render(<Dashboard />);
    fireEvent.click(screen.getByRole('button', { name: /sair/i }));
    expect(mockLogout).toHaveBeenCalledTimes(1);
  });
  
  it('should render GameBoard component if currentGame is active', () => {
    useGame.mockReturnValue({ currentGame: { id: 'game123', status: 'IN_PROGRESS' } });
    render(<Dashboard />);
    expect(screen.getByTestId('gameboard-component')).toBeInTheDocument();
    expect(screen.queryByTestId('lobby-component')).not.toBeInTheDocument();
  });
});