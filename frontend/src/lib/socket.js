import { io } from 'socket.io-client';

class SocketClient {
  constructor() {
    this.socket = null;
  }

  connect(token) {
    if (this.socket) {
      this.disconnect();
    }

    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'https://localhost:3001';
    
    this.socket = io(socketUrl, {
      auth: {
        token: token,
      },
      transports: ['websocket', 'polling'],
    });

    this.socket.on('connect', () => {
      console.log('Socket.IO: Conectado ao servidor com ID:', this.socket.id);
    });

    this.socket.on('disconnect', () => {
      console.log('Socket.IO: Desconectado do servidor');
    });

    this.socket.on('error', (error) => {
      console.error('Socket.IO Erro:', error);
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  inviteToGame(toUserId) {
    if (this.socket?.connected) {
      this.socket.emit('game:invite', { toUserId });
    }
  }

  makeMove(gameId, position) {
    if (this.socket?.connected) {
      this.socket.emit('game:move', { gameId, position });
    }
  }

  abandonGame(gameId) {
    if (this.socket?.connected) {
      this.socket.emit('game:abandon', { gameId });
    }
  }
}

export const socketClient = new SocketClient();