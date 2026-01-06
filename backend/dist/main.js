"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.setGlobalPrefix('api');
    const corsOrigin = process.env.CORS_ORIGIN || true;
    app.enableCors({ origin: corsOrigin });
    app.getHttpAdapter().get('/', (req, res) => {
        res.json({ service: 'kennet-api', status: 'ok' });
    });
    app.getHttpAdapter().get('/api/health', (req, res) => {
        res.json({ service: 'kennet-api', status: 'ok' });
    });
    await app.listen(3000);
    console.log(`API running at http://localhost:3000/api`);
}
bootstrap();
//# sourceMappingURL=main.js.map