const { AppModule } = require("../app.module");
const { Test, TestingModule } = require("@nestjs/testing");

describe("AppModule", () => {
  let appModule;

  beforeEach(async () => {
    const app = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    appModule = app.get(AppModule);
  });

  it("should be defined", () => {
    expect(appModule).toBeDefined();
  });
});
