import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // CORS para Vite dev
  app.enableCors({
    origin: process.env.NODE_ENV === 'development' 
      ? 'http://localhost:5173' 
      : ['https://pdfpulse.online', 'https://www.pdfpulse.online'],
    credentials: true,
  });

  // Global prefix /api
  app.setGlobalPrefix('api');

  // Validation
  app.useGlobalPipes(new ValidationPipe());

  const configService = app.get(ConfigService);
  const port = configService.get('PORT') || 5000;
  
  await app.listen(port);
  console.log(`🚀 Servidor en http://localhost:${port}`);
  console.log(`📧 Test SMTP: http://localhost:${port}/api/test-smtp`);
}
bootstrap();