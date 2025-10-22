const { NestFactory } = require("@nestjs/core");
const { AppModule } = require("./app.module");
const fs = require("node:fs");
const { Logger } = require("@nestjs/common");

async function bootstrap() {
  const httpsOptions = {
    key: fs.readFileSync('../key.pem'),
    cert: fs.readFileSync('../cert.pem'),
  };
  
  const app = await NestFactory.create(AppModule, {
    httpsOptions
  });

  app.enableCors({
    origin: process.env.CORS_ORIGIN || "https://localhost:3000",
    credentials: true,
  });

  app.setGlobalPrefix("api");

  const port = process.env.PORT || 3001;
  await app.listen(port, "0.0.0.0");

  Logger.log(`Application is running on: https://localhost:${port}/api`);
}

bootstrap().catch((error) => {
  Logger.error("Error starting server", error);
  process.exit(1);
});
