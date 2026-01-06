import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
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
