"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const throttler_1 = require("@nestjs/throttler");
const app_module_js_1 = require("./app.module.js");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_js_1.AppModule);
    app.setGlobalPrefix('api/v1');
    app.enableCors({
        origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
    }));
    app.useGlobalGuards(app.get(throttler_1.ThrottlerGuard));
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Gúnrégé API')
        .setDescription('Gúnrégé — Properly Arranged. Virtual try-on backend.')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/docs', app, document);
    const port = parseInt(process.env.PORT || '3001', 10);
    await app.listen(port);
    console.log(`\n  🧵 Gúnrégé Backend running on http://localhost:${port}`);
    console.log(`  📖 Swagger docs at http://localhost:${port}/api/docs\n`);
}
bootstrap();
//# sourceMappingURL=main.js.map