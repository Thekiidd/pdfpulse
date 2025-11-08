import { Module } from '@nestjs/common';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ContactModule } from './contact/contact.module';
import { StatsModule } from './stats/stats.module';
import { CounterEntity } from './stats/entities/counter.entity';
import { ProcesadosEntity } from './stats/entities/procesados.entity';
import { PdfModule } from './pdf/pdf.module'; // Nuevo módulo

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    
    // 1. Configuración de Rate Limiting (10 peticiones/min)
    ThrottlerModule.forRoot([{
      ttl: 60000, 
      limit: 10,  
    }]),
    
    // Tu TypeORM Module existente
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const isProd = configService.get('NODE_ENV') === 'production';
        const dbConfig: any = {
          type: 'mysql' as const,
          entities: [CounterEntity, ProcesadosEntity],
          synchronize: !isProd,
          logging: true,
          retryAttempts: isProd ? 15 : 3,
          retryDelay: 5000,
          extra: {
            connectionLimit: 10,
            acquireTimeout: 120000,
            timeout: 120000,
          },
        };

        if (isProd) {
          dbConfig.url = configService.get('DB_URL_PROD');
          dbConfig.ssl = { rejectUnauthorized: false };
        } else {
          dbConfig.host = configService.get('DB_HOST') || 'localhost';
          dbConfig.port = +configService.get('DB_PORT') || 3306;
          dbConfig.username = configService.get('DB_USER') || 'root';
          dbConfig.password = configService.get('DB_PASSWORD') || '';
          dbConfig.database = configService.get('DB_NAME') || 'pdfpulse_dev';
        }
        return dbConfig;
      },
      inject: [ConfigService],
    }),
    
    // Módulos existentes y nuevo módulo PDF
    ContactModule,
    StatsModule,
    PdfModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // 2. Aplicar ThrottlerGuard globalmente
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}