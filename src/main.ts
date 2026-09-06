import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ThrottlerGuard } from '@nestjs/throttler';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ── Global prefix ──────────────────────────────────────────────────────────
  app.setGlobalPrefix('api/v1');

  // ── CORS — §25 ────────────────────────────────────────────────────────────
  app.enableCors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  });

  // ── Validation pipe — §25 (validate all incoming DTOs) ─────────────────────
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // ── Rate limiting — §25.1 ──────────────────────────────────────────────────
  app.useGlobalGuards(app.get(ThrottlerGuard));

  // ── Swagger — OpenAPI documentation ────────────────────────────────────────
  const config = new DocumentBuilder()
    .setTitle('Gúnrégé API')
    .setDescription('Gúnrégé — Properly Arranged. Virtual try-on backend.')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // ── Start server ───────────────────────────────────────────────────────────
  const port = parseInt(process.env.PORT || '3001', 10);
  await app.listen(port);
  console.log(`\n  🧵 Gúnrégé Backend running on http://localhost:${port}`);
  console.log(`  📖 Swagger docs at http://localhost:${port}/api/docs\n`);
}
bootstrap();
