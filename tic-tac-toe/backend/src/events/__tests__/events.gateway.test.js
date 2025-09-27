const { EventsGateway } = require("../events.gateway");
const { EventBusService } = require("../event-bus.service");

describe("EventsGateway", () => {
  let eventsGateway;
  let eventBusService;
  let jwtService;
  let gamesService;
  let usersService;
  let logsService;
  let server;

  beforeEach(() => {
    jwtService = {
      verifyAsync: jest.fn().mockResolvedValue({ sub: 'testUserId', username: 'testUsername' }),
    };
    eventBusService = {
      server: {
        emit: jest.fn(),
      },
      emitUserOnline: jest.fn(),
      emitUserOffline: jest.fn(),
      onUserOnline: jest.fn(),
      onUserOffline: jest.fn(),
      onGameInvitationSent: jest.fn(),
      onGameInvitationAccepted: jest.fn(),
      onGameInvitationRejected: jest.fn(),
      onGameStarted: jest.fn(),
      onMoveMade: jest.fn(),
      onGameFinished: jest.fn(),
      onGameAbandoned: jest.fn(),
    };
    gamesService = {
      createInvitation: jest.fn(),
      makeMove: jest.fn(),
      abandonGame: jest.fn(),
    };
    usersService = {
      updateOnlineStatus: jest.fn(),
      findById: jest.fn().mockResolvedValue({ username: 'testUsername' }),
    };
    logsService = {
      logEvent: jest.fn(),
    };
    server = {
      emit: jest.fn(),
      to: jest.fn().mockReturnThis(),
    };

    eventsGateway = new EventsGateway(jwtService, eventBusService, gamesService, usersService, logsService);
    eventsGateway.server = server;
  });

  it("should be defined", () => {
    expect(eventsGateway).toBeDefined();
  });

  it("should handle connection", async () => {
    const client = {
      id: "test",
      handshake: {
        auth: {
          token: "testToken",
        },
      },
      emit: jest.fn(),
      disconnect: jest.fn(),
    };

    await eventsGateway.handleConnection(client);

    expect(jwtService.verifyAsync).toHaveBeenCalledWith("testToken", {
      secret: process.env.JWT_SECRET,
    });
    expect(usersService.updateOnlineStatus).toHaveBeenCalledWith("testUserId", true);
    expect(eventBusService.emitUserOnline).toHaveBeenCalledWith("testUserId", "testUsername");
    expect(client.emit).toHaveBeenCalledWith("connected", { userId: "testUserId", username: "testUsername" });
    expect(logsService.logEvent).toHaveBeenCalledWith("USER_CONNECTED", {
      userId: "testUserId",
      username: "testUsername",
      socketId: "test",
    });
  });

  it("should handle disconnect", async () => {
    const client = { id: "test" };
    eventsGateway.userSockets = new Map();
    eventsGateway.userSockets.set("test", "testUserId");
    eventsGateway.connectedUsers = new Map();
    eventsGateway.connectedUsers.set("testUserId", "test");

    usersService.findById = jest.fn().mockResolvedValue({ username: 'testUsername' });

    await eventsGateway.handleDisconnect(client);

    expect(usersService.updateOnlineStatus).toHaveBeenCalledWith("testUserId", false);
    expect(eventBusService.emitUserOffline).toHaveBeenCalledWith("testUserId", "testUsername");
    expect(logsService.logEvent).toHaveBeenCalledWith("USER_DISCONNECTED", {
      userId: "testUserId",
      username: "testUsername",
    });
  });
});
