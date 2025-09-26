'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { socketClient } from '@/lib/socket';
import { apiClient } from '@/lib/api';
import { useAuth } from './AuthContext';

const GameContext = createContext();

export function GameProvider({ children }) {
  const { user, isAuthenticated } = useAuth();
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [pendingInvitations, setPendingInvitations] = useState([]);
  const [sentInvitations, setSentInvitations] = useState([]);
  const [currentGame, setCurrentGame] = useState(null);
  const [gameHistory, setGameHistory] = useState([]);

  useEffect(() => {
    if (isAuthenticated) {
      loadInitialData();
      setupSocketListeners();
    }

    return () => {
      cleanupSocketListeners();
    };
  }, [isAuthenticated]);

  const loadInitialData = async () => {
    try {
      const [users, pending, sent, games] = await Promise.all([
        apiClient.getOnlineUsers(),
        apiClient.getPendingInvitations(),
        apiClient.getSentInvitations(),
        apiClient.getUserGames(),
      ]);

      setOnlineUsers(users);
      setPendingInvitations(pending);
      setSentInvitations(sent);
      setGameHistory(games);

      // Check for active game
      const activeGame = games.find(game => game.status === 'IN_PROGRESS');
      if (activeGame) {
        setCurrentGame(activeGame);
      }
    } catch (error) {
      console.error('Failed to load initial data:', error);
    }
  };

  const setupSocketListeners = () => {
    socketClient.on('user:online', handleUserOnline);
    socketClient.on('user:offline', handleUserOffline);
    socketClient.on('game:invitation:received', handleInvitationReceived);
    socketClient.on('game:invitation:accepted', handleInvitationAccepted);
    socketClient.on('game:invitation:rejected', handleInvitationRejected);
    socketClient.on('game:started', handleGameStarted);
    socketClient.on('game:move:made', handleMoveMade);
    socketClient.on('game:finished', handleGameFinished);
    socketClient.on('game:abandoned', handleGameAbandoned);
  };

  const cleanupSocketListeners = () => {
    socketClient.off('user:online', handleUserOnline);
    socketClient.off('user:offline', handleUserOffline);
    socketClient.off('game:invitation:received', handleInvitationReceived);
    socketClient.off('game:invitation:accepted', handleInvitationAccepted);
    socketClient.off('game:invitation:rejected', handleInvitationRejected);
    socketClient.off('game:started', handleGameStarted);
    socketClient.off('game:move:made', handleMoveMade);
    socketClient.off('game:finished', handleGameFinished);
    socketClient.off('game:abandoned', handleGameAbandoned);
  };

  const handleUserOnline = (data) => {
    setOnlineUsers(prev => {
      const exists = prev.find(u => u.id === data.userId);
      if (!exists) {
        return [...prev, { id: data.userId, username: data.username, isOnline: true }];
      }
      return prev.map(u => u.id === data.userId ? { ...u, isOnline: true } : u);
    });
  };

  const handleUserOffline = (data) => {
    setOnlineUsers(prev => prev.filter(u => u.id !== data.userId));
  };

  const handleInvitationReceived = (invitation) => {
    setPendingInvitations(prev => [invitation, ...prev]);
  };

  const handleInvitationAccepted = (data) => {
    setSentInvitations(prev => prev.filter(inv => inv.id !== data.invitation.id));
    setCurrentGame(data.game);
  };

  const handleInvitationRejected = (data) => {
    setSentInvitations(prev => prev.filter(inv => inv.id !== data.id));
  };

  const handleGameStarted = (game) => {
    setCurrentGame(game);
    setPendingInvitations(prev => prev.filter(inv => 
      inv.fromUserId !== game.player1Id || inv.toUserId !== game.player2Id
    ));
  };

  const handleMoveMade = (data) => {
    if (currentGame && currentGame.id === data.game.id) {
      setCurrentGame(data.game);
    }
  };

  const handleGameFinished = (game) => {
    if (currentGame && currentGame.id === game.id) {
      setCurrentGame(game);
      // Add to history
      setGameHistory(prev => [game, ...prev.filter(g => g.id !== game.id)]);
    }
  };

  const handleGameAbandoned = (game) => {
    if (currentGame && currentGame.id === game.id) {
      setCurrentGame(game);
      // Add to history
      setGameHistory(prev => [game, ...prev.filter(g => g.id !== game.id)]);
    }
  };

  const inviteUser = async (userId) => {
    try {
      const invitation = await apiClient.createInvitation(userId);
      setSentInvitations(prev => [invitation, ...prev]);
      return invitation;
    } catch (error) {
      throw error;
    }
  };

  const acceptInvitation = async (invitationId) => {
    try {
      const game = await apiClient.acceptInvitation(invitationId);
      setPendingInvitations(prev => prev.filter(inv => inv.id !== invitationId));
      setCurrentGame(game);
      return game;
    } catch (error) {
      throw error;
    }
  };

  const rejectInvitation = async (invitationId) => {
    try {
      await apiClient.rejectInvitation(invitationId);
      setPendingInvitations(prev => prev.filter(inv => inv.id !== invitationId));
    } catch (error) {
      throw error;
    }
  };

  const makeMove = async (position) => {
    if (!currentGame) return;
    
    try {
      const updatedGame = await apiClient.makeMove(currentGame.id, position);
      setCurrentGame(updatedGame);
      return updatedGame;
    } catch (error) {
      throw error;
    }
  };

  const abandonGame = async () => {
    if (!currentGame) return;
    
    try {
      const updatedGame = await apiClient.abandonGame(currentGame.id);
      setCurrentGame(updatedGame);
      setGameHistory(prev => [updatedGame, ...prev.filter(g => g.id !== updatedGame.id)]);
      return updatedGame;
    } catch (error) {
      throw error;
    }
  };

  const value = {
    onlineUsers,
    pendingInvitations,
    sentInvitations,
    currentGame,
    gameHistory,
    inviteUser,
    acceptInvitation,
    rejectInvitation,
    makeMove,
    abandonGame,
    refreshData: loadInitialData,
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}

