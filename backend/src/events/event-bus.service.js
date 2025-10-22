const { Injectable } = require('@nestjs/common');
const { EventEmitter } = require('events');

@Injectable()
class EventBusService extends EventEmitter {
  constructor() {
    super();
    this.setMaxListeners(100);
  }

  emitUserOnline(userId, username) {
    this.emit('user.online', { userId, username, timestamp: new Date() });
  }

  emitUserOffline(userId, username) {
    this.emit('user.offline', { userId, username, timestamp: new Date() });
  }

  emitGameInvitationSent(invitation) {
    this.emit('game.invitation.sent', {
      ...invitation,
      timestamp: new Date(),
    });
  }

  emitGameInvitationAccepted(invitation, game) {
    this.emit('game.invitation.accepted', {
      invitation,
      game,
      timestamp: new Date(),
    });
  }

  emitGameInvitationRejected(invitation) {
    this.emit('game.invitation.rejected', {
      ...invitation,
      timestamp: new Date(),
    });
  }

  emitGameStarted(game) {
    this.emit('game.started', {
      ...game,
      timestamp: new Date(),
    });
  }

  emitMoveMade(game, move) {
    this.emit('game.move.made', {
      game,
      move,
      timestamp: new Date(),
    });
  }

  emitGameFinished(game) {
    this.emit('game.finished', {
      ...game,
      timestamp: new Date(),
    });
  }

  emitGameAbandoned(game, abandonedBy) {
    this.emit('game.abandoned', {
      ...game,
      abandonedBy,
      timestamp: new Date(),
    });
  }

  onUserOnline(callback) {
    this.on('user.online', callback);
  }

  onUserOffline(callback) {
    this.on('user.offline', callback);
  }

  onGameInvitationSent(callback) {
    this.on('game.invitation.sent', callback);
  }

  onGameInvitationAccepted(callback) {
    this.on('game.invitation.accepted', callback);
  }

  onGameInvitationRejected(callback) {
    this.on('game.invitation.rejected', callback);
  }

  onGameStarted(callback) {
    this.on('game.started', callback);
  }

  onMoveMade(callback) {
    this.on('game.move.made', callback);
  }

  onGameFinished(callback) {
    this.on('game.finished', callback);
  }

  onGameAbandoned(callback) {
    this.on('game.abandoned', callback);
  }

  removeAllListenersForEvent(eventName) {
    this.removeAllListeners(eventName);
  }

  getEventStats() {
    return {
      maxListeners: this.getMaxListeners(),
      eventNames: this.eventNames(),
      listenerCount: this.eventNames().reduce((acc, eventName) => {
        acc[eventName] = this.listenerCount(eventName);
        return acc;
      }, {}),
    };
  }
}

module.exports = { EventBusService };

