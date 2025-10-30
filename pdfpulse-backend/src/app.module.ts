import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { join } from 'path'; // <-- ELIMINADO (ya no se usa)
import { MailerModule } from '@nestjs-modules/mailer';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ContactModule } from './contact/contact.module';
import { StatsModule } from './stats/stats.module';
import { CounterEntity } from './stats/entities/counter.entity';
import { ProcesadosEntity } from './stats/entities/procesados.entity';
// import { ServeStaticModule } from '@nestjs/serve-static'; // <-- ELIMINADO

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    
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

        console.log('DB CONEXIÓN:', {
          entorno: isProd ? 'PRODUCCIÓN (Railway)' : 'DESARROLLO (XAMPP)',
          url: isProd ? 'turntable.proxy.rlwy.net:59019' : undefined,
          host: isProd ? undefined : dbConfig.host,
          base: isProd ? 'railway' : dbConfig.database,
        });

        return dbConfig;
      },
      inject: [ConfigService],
    }),

    // Mailer IONOS (corregido)
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return {
          transport: {
            host: 'smtp.ionos.mx', 
            port: 465,           
            secure: true,        
            auth: {
              user: configService.get('EMAIL_USER'),
              pass: configService.get('EMAIL_PASS'),
            },
            tls: {
              rejectUnauthorized: false, 
            },
          },
          defaults: {
            from: `"PDFPulse Contacto" <${configService.get('EMAIL_USER')}>`,
          },
        };
      },
      inject: [ConfigService],
    }),

    // Serve Vite SPA (solo prod) <-- BLOQUE ELIMINADO
    
    ContactModule,
    StatsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}