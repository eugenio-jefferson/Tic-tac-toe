const { EventBusService } = require("../event-bus.service");

describe("EventBusService", () => {
  let eventBusService;

  beforeEach(() => {
    eventBusService = new EventBusService();
  });

  it("should be defined", () => {
    expect(eventBusService).toBeDefined();
  });

  it("should emit a game invitation sent event", () => {
    const invitation = { id: 1, fromUserId: 1, toUserId: 2 };

    eventBusService.emit = jest.fn();
    eventBusService.emitGameInvitationSent(invitation);

    expect(eventBusService.emit).toHaveBeenCalledWith(
      "game.invitation.sent",
      {
        ...invitation,
        timestamp: expect.any(Date),
      }
    );
  });

  it("should emit a game invitation accepted event", () => {
    const invitation = { id: 1, fromUserId: 1, toUserId: 2 };
    const game = { id: 1, player1Id: 1, player2Id: 2 };

    eventBusService.emit = jest.fn();
    eventBusService.emitGameInvitationAccepted(invitation, game);

    expect(eventBusService.emit).toHaveBeenCalledWith(
      "game.invitation.accepted",
      { invitation, game, timestamp: expect.any(Date) }
    );
  });

  it("should emit a game invitation rejected event", () => {
    const invitation = { id: 1, fromUserId: 1, toUserId: 2 };

    eventBusService.emit = jest.fn();
    eventBusService.emitGameInvitationRejected(invitation);

    expect(eventBusService.emit).toHaveBeenCalledWith(
      "game.invitation.rejected",
      { ...invitation, timestamp: expect.any(Date) }
    );
  });
});
