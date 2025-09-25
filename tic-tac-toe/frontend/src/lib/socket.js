import { io } from 'socket.io-client';

class SocketClient {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.listeners = new Map();
  }

  connect(token) {
    if (this.socket) {
      this.disconnect();
    }

    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001';
    
    this.socket = io(socketUrl, {
      auth: {
        token: token,
      },
      transports: ['websocket', 'polling'],
    });

    this.socket.on('connect', () => {
      console.log('Connected to server');
      this.isConnected = true;
      this.emit('connection', { connected: true });
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from server');
      this.isConnected = false;
      this.emit('connection', { connected: false });
    });

    this.socket.on('connected', (data) => {
      console.log('Server confirmed connection:', data);
      this.emit('authenticated', data);
    });

    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
      this.emit('error', error);
    });

    // Game events
    this.socket.on('user:online', (data) => {
      this.emit('user:online', data);
    });

    this.socket.on('user:offline', (data) => {
      this.emit('user:offline', data);
    });

    this.socket.on('game:invitation:received', (data) => {
      this.emit('game:invitation:received', data);
    });

    this.socket.on('game:invitation:accepted', (data) => {
      this.emit('game:invitation:accepted', data);
    });

    this.socket.on('game:invitation:rejected', (data) => {
      this.emit('game:invitation:rejected', data);
    });

    this.socket.on('game:started', (data) => {
      this.emit('game:started', data);
    });

    this.socket.on('game:move:made', (data) => {
      this.emit('game:move:made', data);
    });

    this.socket.on('game:finished', (data) => {
      this.emit('game:finished', data);
    });

    this.socket.on('game:abandoned', (data) => {
      this.emit('game:abandoned', data);
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  // Event emitter methods
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  off(event, callback) {
    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error('Error in socket event callback:', error);
        }
      });
    }
  }

  // Game actions
  inviteToGame(toUserId) {
    if (this.socket && this.isConnected) {
      this.socket.emit('game:invite', { toUserId });
    }
  }

  makeMove(gameId, position) {
    if (this.socket && this.isConnected) {
      this.socket.emit('game:move', { gameId, position });
    }
  }

  abandonGame(gameId) {
    if (this.socket && this.isConnected) {
      this.socket.emit('game:abandon', { gameId });
    }
  }

  ping() {
    if (this.socket && this.isConnected) {
      this.socket.emit('ping');
    }
  }
}

export const socketClient = new SocketClient();

