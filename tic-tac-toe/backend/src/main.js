const { NestFactory } = require("@nestjs/core");
const { AppModule } = require("./app.module");
const { Logger } = require("@nestjs/common");

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
  });

  app.setGlobalPrefix("api");

  const port = process.env.PORT || 3001;
  await app.listen(port, "0.0.0.0");

  Logger.log(`Application is running on: http://localhost:${port}/api`);
}

bootstrap().catch((error) => {
  Logger.error("Error starting server", error);
  process.exit(1);
});
