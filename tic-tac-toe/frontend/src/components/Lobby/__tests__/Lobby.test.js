import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Lobby from '../Lobby';
import { useAuth } from '@/contexts/AuthContext';
import { useGame } from '@/contexts/GameContext';
import '@testing-library/jest-dom';

jest.mock('@/contexts/AuthContext', () => ({
  useAuth: jest.fn(),
}));

jest.mock('@/contexts/GameContext', () => ({
  useGame: jest.fn(),
}));

describe('Lobby', () => {
  const mockUser = { id: 'user1', username: 'CurrentUser' };
  const mockOnlineUsers = [
    { id: 'user2', username: 'Player2', isOnline: true },
    { id: 'user3', username: 'Player3', isOnline: true },
  ];
  const mockPendingInvitations = [
    { id: 'inv1', fromUser: { username: 'Inviter1' }, fromUserId: 'user4', toUserId: 'user1', createdAt: new Date().toISOString() },
  ];
  const mockSentInvitations = [
    { id: 'inv2', toUser: { username: 'Invited1' }, fromUserId: 'user1', toUserId: 'user5', createdAt: new Date().toISOString() },
  ];

  const mockInviteUser = jest.fn();
  const mockAcceptInvitation = jest.fn();
  const mockRejectInvitation = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useAuth.mockReturnValue({ user: mockUser });
    useGame.mockReturnValue({
      onlineUsers: mockOnlineUsers,
      pendingInvitations: mockPendingInvitations,
      sentInvitations: mockSentInvitations,
      inviteUser: mockInviteUser,
      acceptInvitation: mockAcceptInvitation,
      rejectInvitation: mockRejectInvitation,
    });
  });

  it('should render "Convites Recebidos" section if there are pending invitations', () => {
    render(<Lobby />);
    expect(screen.getByText(/convites recebidos/i)).toBeInTheDocument();
    expect(screen.getByText(/inviter1 te convidou para jogar/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /aceitar/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /recusar/i })).toBeInTheDocument();
  });

  it('should not render "Convites Recebidos" section if no pending invitations', () => {
    useGame.mockReturnValue({ ...useGame(), pendingInvitations: [] });
    render(<Lobby />);
    expect(screen.queryByText(/convites recebidos/i)).not.toBeInTheDocument();
  });


  it('should not render "Convites Enviados" section if no sent invitations', () => {
    useGame.mockReturnValue({ ...useGame(), sentInvitations: [] });
    render(<Lobby />);
    expect(screen.queryByText(/convites enviados/i)).not.toBeInTheDocument();
  });

  it('should render "Usuários Online" section with available users', () => {
    render(<Lobby />);
    expect(screen.getByText(/usuários online \(2\)/i)).toBeInTheDocument();
    expect(screen.getByText('Player2')).toBeInTheDocument();
    expect(screen.getByText('Player3')).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /convidar/i }).length).toBe(2);
  });

  it('should not list current user in "Usuários Online"', () => {
    useGame.mockReturnValue({
      ...useGame(),
      onlineUsers: [{ id: 'user1', username: 'CurrentUser' }, { id: 'user2', username: 'Player2' }],
    });
    render(<Lobby />);
    expect(screen.getByText(/usuários online \(1\)/i)).toBeInTheDocument();
    expect(screen.queryByText('CurrentUser')).not.toBeInTheDocument();
    expect(screen.getByText('Player2')).toBeInTheDocument();
  });

  it('should display "Nenhum outro usuário online." if no other users are online', () => {
    useGame.mockReturnValue({ ...useGame(), onlineUsers: [{ id: 'user1', username: 'CurrentUser' }] });
    render(<Lobby />);
    expect(screen.getByText(/nenhum outro usuário online./i)).toBeInTheDocument();
  });

  it('should call inviteUser when "Convidar" button is clicked', async () => {
    mockInviteUser.mockResolvedValueOnce({});
    render(<Lobby />);
    fireEvent.click(screen.getAllByRole('button', { name: /convidar/i })[0]); 
    await waitFor(() => expect(mockInviteUser).toHaveBeenCalledWith('user2'));
  });

  it('should disable "Convidar" button if an invitation has already been sent to that user', () => {
    useGame.mockReturnValue({
      ...useGame(),
      onlineUsers: [{ id: 'user2', username: 'Player2', isOnline: true }],
      sentInvitations: [{ id: 'invSent', toUserId: 'user2', fromUserId: 'user1', toUser: { username: 'Player2' } }],
    });
    render(<Lobby />);
    expect(screen.getByRole('button', { name: /enviado/i })).toBeDisabled();
  });

  it('should call acceptInvitation when "Aceitar" button is clicked', async () => {
    mockAcceptInvitation.mockResolvedValueOnce({});
    render(<Lobby />);
    fireEvent.click(screen.getByRole('button', { name: /aceitar/i }));
    await waitFor(() => expect(mockAcceptInvitation).toHaveBeenCalledWith('inv1'));
  });

  it('should call rejectInvitation when "Recusar" button is clicked', async () => {
    mockRejectInvitation.mockResolvedValueOnce({});
    render(<Lobby />);
    fireEvent.click(screen.getByRole('button', { name: /recusar/i }));
    await waitFor(() => expect(mockRejectInvitation).toHaveBeenCalledWith('inv1'));
  });

  it('should display error message if inviteUser fails', async () => {
    mockInviteUser.mockRejectedValueOnce(new Error('Failed to send invitation'));
    render(<Lobby />);
    fireEvent.click(screen.getAllByRole('button', { name: /convidar/i })[0]);
    await waitFor(() => expect(screen.getByText(/failed to send invitation/i)).toBeInTheDocument());
  });

  it('should display error message if acceptInvitation fails', async () => {
    mockAcceptInvitation.mockRejectedValueOnce(new Error('Failed to accept invitation'));
    render(<Lobby />);
    fireEvent.click(screen.getByRole('button', { name: /aceitar/i }));
    await waitFor(() => expect(screen.getByText(/failed to accept invitation/i)).toBeInTheDocument());
  });

  it('should display error message if rejectInvitation fails', async () => {
    mockRejectInvitation.mockRejectedValueOnce(new Error('Failed to reject invitation'));
    render(<Lobby />);
    fireEvent.click(screen.getByRole('button', { name: /recusar/i }));
    await waitFor(() => expect(screen.getByText(/failed to reject invitation/i)).toBeInTheDocument());
  });

  it('should disable buttons when loading is true', async () => {
    mockInviteUser.mockImplementation(() => new Promise(() => {})); // Never resolves
    render(<Lobby />);
    fireEvent.click(screen.getAllByRole('button', { name: /convidar/i })[0]);
    expect(screen.getAllByRole('button', { name: /convidar/i })[0]).toBeDisabled();
    expect(screen.getByRole('button', { name: /aceitar/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /recusar/i })).toBeDisabled();
  });
});
