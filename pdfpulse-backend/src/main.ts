import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet'; // Para seguridad web

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // === HARDENING WEB ===
  app.use(helmet()); 

  // 1. Definición de URLs permitidas
  const isProd = configService.get('NODE_ENV') === 'production';
  const frontendUrl = isProd ? 'https://pdfpulse.online' : 'http://localhost:5173';

  // 2. Configuración de CORS
  app.enableCors({
    origin: [frontendUrl, 'https://www.pdfpulse.online'], 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Global prefix /api
  app.setGlobalPrefix('api');

  // Validation Pipe para DTOs
  app.useGlobalPipes(new ValidationPipe());

  const port = configService.get('PORT') || 5000;
  
  await app.listen(port);
  console.log(`🚀 Servidor NestJS corriendo en: http://localhost:${port}`);
}
bootstrap();