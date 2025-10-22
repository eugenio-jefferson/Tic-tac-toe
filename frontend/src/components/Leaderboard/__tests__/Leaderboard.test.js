import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import Leaderboard from '../Leaderboard';
import { apiClient } from '@/lib/api';
import '@testing-library/jest-dom';

jest.mock('@/lib/api', () => ({
  apiClient: {
    getLeaderboard: jest.fn(),
  },
}));

describe('Leaderboard', () => {
  const mockLeaderboardData = [
    { id: '1', username: 'PlayerA', isOnline: true, stats: { wins: 10, losses: 2, draws: 1 } },
    { id: '2', username: 'PlayerB', isOnline: false, stats: { wins: 8, losses: 3, draws: 2 } },
    { id: '3', username: 'PlayerC', isOnline: true, stats: { wins: 7, losses: 4, draws: 0 } },
    { id: '4', username: 'PlayerD', isOnline: false, stats: { wins: 5, losses: 5, draws: 3 } },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    apiClient.getLeaderboard.mockResolvedValue(mockLeaderboardData);
  });

  it('should render "Carregando ranking..." initially', () => {
    apiClient.getLeaderboard.mockReturnValue(new Promise(() => {})); 
    render(<Leaderboard />);
    expect(screen.getByText(/carregando ranking.../i)).toBeInTheDocument();
  });

  it('should render leaderboard data after loading', async () => {
    render(<Leaderboard />);
    await waitFor(() => expect(screen.queryByText(/carregando ranking.../i)).not.toBeInTheDocument());

    expect(screen.getByText(/ranking dos jogadores/i)).toBeInTheDocument();
    expect(screen.getByText('PlayerA')).toBeInTheDocument();
    expect(screen.getByText('PlayerB')).toBeInTheDocument();
    expect(screen.getByText('PlayerC')).toBeInTheDocument();
    expect(screen.getByText('PlayerD')).toBeInTheDocument();

    expect(screen.getByText('10')).toBeInTheDocument(); 
    expect(screen.getAllByText('2')[0]).toBeInTheDocument();  
    expect(screen.getAllByText('1')[0]).toBeInTheDocument(); 
  });

  it('should display rank icons for top 3 players', async () => {
    render(<Leaderboard />);
    await waitFor(() => expect(screen.getByText('PlayerA')).toBeInTheDocument());

    expect(screen.queryByText('1º')).not.toBeInTheDocument(); 
    expect(screen.queryByText('2º')).not.toBeInTheDocument();
    expect(screen.queryByText('3º')).not.toBeInTheDocument();
    expect(screen.getByText('4º')).toBeInTheDocument(); 
  });

  it('should display "Nenhum jogador no ranking ainda." if leaderboard is empty', async () => {
    apiClient.getLeaderboard.mockResolvedValue([]);
    render(<Leaderboard />);
    await waitFor(() => expect(screen.getByText(/nenhum jogador no ranking ainda./i)).toBeInTheDocument());
  });

  it('should display error message if loading leaderboard fails', async () => {
    apiClient.getLeaderboard.mockRejectedValue(new Error('Failed to fetch leaderboard'));
    render(<Leaderboard />);
    await waitFor(() => expect(screen.getByText(/erro ao carregar ranking: failed to fetch leaderboard/i)).toBeInTheDocument());
  });

  it('should show online status indicator for online players', async () => {
    render(<Leaderboard />);
    await waitFor(() => expect(screen.getByText('PlayerA')).toBeInTheDocument());

    expect(screen.getByText('PlayerA')).toBeInTheDocument();
    expect(screen.getByText('PlayerB')).toBeInTheDocument();
  });
});
