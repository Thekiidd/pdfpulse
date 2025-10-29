import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { MailerModule } from '@nestjs-modules/mailer';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ContactModule } from './contact/contact.module';
import { StatsModule } from './stats/stats.module';
import { CounterEntity } from './stats/entities/counter.entity';
import { ProcesadosEntity } from './stats/entities/procesados.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    /* ------------------- DATABASE ( Railway Fix ) ------------------- */
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => {
        const isProd = cfg.get<string>('NODE_ENV') === 'production';

        // Utilizamos la URL de conexión completa (DB_URL_PROD) en producción para evitar ETIMEDOUT.
        // Mantenemos la lógica de variables separadas para desarrollo local (DB_HOST, etc.)
        const connectionOptions = isProd
          ? {
              url: cfg.get<string>('DB_URL_PROD'), // <-- ¡CRUCIAL! Debe estar en Render
            }
          : {
              host: cfg.get<string>('DB_HOST'),
              port: Number(cfg.get<string>('DB_PORT') ?? 3306),
              username: cfg.get<string>('DB_USER'),
              password: cfg.get<string>('DB_PASSWORD'),
              database: cfg.get<string>('DB_NAME'),
            };

        return {
          type: 'mysql' as const,
          ...connectionOptions, // Esparcir las opciones (url o host/port/etc.)

          entities: [CounterEntity, ProcesadosEntity],
          synchronize: !isProd,
          logging: !isProd,

          // ---- SSL CRÍTICO: Necesario para que Railway acepte la conexión externa de Render ----
          ssl: isProd ? { rejectUnauthorized: false } : false,

          // ---- Mantener el intento de reconexión y timeouts ----
          extra: {
            acquireTimeout: 30_000,
            timeout: 30_000,
            reconnect: true,
          },
          retryAttempts: isProd ? 10 : 0,
          retryDelay: 5_000,
        };
      },
    }),

    /* ------------------- MAILER (No necesita cambios) ------------------- */
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        //... (código del Mailer sin cambios)
        transport: {
          host: 'smtp.ionos.mx',
          port: 465,
          secure: true,
          auth: {
            user: cfg.get<string>('EMAIL_USER'),
            pass: cfg.get<string>('EMAIL_PASS'),
          },
          tls: { rejectUnauthorized: false },
        },
        defaults: {
          from: `"PDFPulse Contacto" <${cfg.get<string>('EMAIL_USER')}>`,
        },
      }),
    }),

    /* ------------------- SERVE STATIC (No necesita cambios) ------------------- */
    ServeStaticModule.forRootAsync({
      // ... (código para servir estáticos sin cambios)
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => {
        if (cfg.get<string>('NODE_ENV') !== 'production') return [];
        return [
          {
            rootPath: join(__dirname, '..', 'dist'), 
            exclude: ['/api/*'],
          },
        ];
      },
    }),

    ContactModule,
    StatsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}