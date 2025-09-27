'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
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

  const handleUserOnline = useCallback((data) => {
    console.log('Socket event: user:online', data);
    setOnlineUsers(prev => {
      const exists = prev.find(u => u.id === data.userId);
      if (!exists) {
        return [...prev, { id: data.userId, username: data.username, isOnline: true }];
      }
      return prev.map(u => u.id === data.userId ? { ...u, isOnline: true } : u);
    });
  }, []);

  const handleUserOffline = useCallback((data) => {
    console.log('Socket event: user:offline', data);
    setOnlineUsers(prev => prev.filter(u => u.id !== data.userId));
  }, []);

  const handleInvitationReceived = useCallback((invitation) => {
    console.log('Socket event: game:invitation:received', invitation);
    setPendingInvitations(prev => [invitation, ...prev]);
  }, []);

  const handleInvitationAccepted = useCallback((data) => {
    console.log('Socket event: game:invitation:accepted', data);
    setSentInvitations(prev => prev.filter(inv => inv.id !== data.invitation.id));
    setCurrentGame(data.game);
  }, []);

  const handleInvitationRejected = useCallback((data) => {
    console.log('Socket event: game:invitation:rejected', data);
    setSentInvitations(prev => prev.filter(inv => inv.id !== data.id));
  }, []);

  const handleGameStarted = useCallback((game) => {
    console.log('Socket event: game:started', game);
    setCurrentGame(game);
    setPendingInvitations(prev => prev.filter(inv => 
      inv.fromUserId !== game.player1Id || inv.toUserId !== game.player2Id
    ));
  }, []);

  const handleMoveMade = useCallback((data) => {
    console.log('Socket event: game:move:made', data);
    setCurrentGame(curr => (curr && curr.id === data.game.id ? data.game : curr));
  }, []);

  const handleGameFinished = useCallback((game) => {
    console.log('Socket event: game:finished', game);
    setCurrentGame(curr => (curr && curr.id === game.id ? game : curr));
    setGameHistory(prev => [game, ...prev.filter(g => g.id !== game.id)]);
  }, []);

  const handleGameAbandoned = useCallback((game) => {
    console.log('Socket event: game:abandoned', game);
    setCurrentGame(curr => (curr && curr.id === game.id ? game : curr));
    setGameHistory(prev => [game, ...prev.filter(g => g.id !== game.id)]);
  }, []);

  useEffect(() => {
    if (isAuthenticated && socketClient.socket) {
      console.log('Configurando listeners do socket no GameContext...');
      
      const socket = socketClient.socket;

      socket.on('user:online', handleUserOnline);
      socket.on('user:offline', handleUserOffline);
      socket.on('game:invitation:received', handleInvitationReceived);
      socket.on('game:invitation:accepted', handleInvitationAccepted);
      socket.on('game:invitation:rejected', handleInvitationRejected);
      socket.on('game:started', handleGameStarted);
      socket.on('game:move:made', handleMoveMade);
      socket.on('game:finished', handleGameFinished);
      socket.on('game:abandoned', handleGameAbandoned);

      return () => {
        console.log('Limpando listeners do socket no GameContext...');
        socket.off('user:online', handleUserOnline);
        socket.off('user:offline', handleUserOffline);
        socket.off('game:invitation:received', handleInvitationReceived);
        socket.off('game:invitation:accepted', handleInvitationAccepted);
        socket.off('game:invitation:rejected', handleInvitationRejected);
        socket.off('game:started', handleGameStarted);
        socket.off('game:move:made', handleMoveMade);
        socket.off('game:finished', handleGameFinished);
        socket.off('game:abandoned', handleGameAbandoned);
      };
    }
  }, [
    isAuthenticated,
    handleUserOnline,
    handleUserOffline,
    handleInvitationReceived,
    handleInvitationAccepted,
    handleInvitationRejected,
    handleGameStarted,
    handleMoveMade,
    handleGameFinished,
    handleGameAbandoned
  ]);
  
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
        const activeGame = games.find(game => game.status === 'IN_PROGRESS' || game.status === 'WAITING');
        if (activeGame) {
            setCurrentGame(activeGame);
        }
    } catch (error) {
        console.error('Falha ao carregar dados iniciais:', error);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadInitialData();
    }
  }, [isAuthenticated]);



  const inviteUser = async (userId) => {
    try {
      const invitation = await apiClient.createInvitation(userId);
      
      setSentInvitations(prev => [invitation, ...prev]);
      
      return invitation;
    } catch (error) {
      console.error("Falha ao enviar convite:", error);
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
    if (currentGame) {
      socketClient.makeMove(currentGame.id, position);
    }
  };

  const abandonGame = async () => {
    if (currentGame) {
      socketClient.abandonGame(currentGame.id);
    }
  };

   const leaveGame = () => {
    setCurrentGame(null);
    loadInitialData(); 
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
    leaveGame,
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