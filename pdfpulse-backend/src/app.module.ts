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

    /* ------------------- DATABASE ------------------- */
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => {
        const isProd = cfg.get<string>('NODE_ENV') === 'production';

        return {
          type: 'mysql' as const,
          // Render MySQL → use the *internal* hostname
          host: cfg.get<string>(isProd ? 'DB_HOST_PROD' : 'DB_HOST'),
          port: Number(cfg.get<string>(isProd ? 'DB_PORT_PROD' : 'DB_PORT') ?? 3306),
          username: cfg.get<string>(isProd ? 'DB_USER_PROD' : 'DB_USER'),
          password: cfg.get<string>(isProd ? 'DB_PASSWORD_PROD' : 'DB_PASSWORD'),
          database: cfg.get<string>(isProd ? 'DB_NAME_PROD' : 'DB_NAME'),

          entities: [CounterEntity, ProcesadosEntity],
          synchronize: !isProd,               // never auto-sync in prod
          logging: !isProd,

          // ---- Render MySQL is private, no SSL needed ----
          ssl: isProd ? false : false,

          // ---- Make the connection more resilient ----
          extra: {
            // 30 s to acquire a connection from the pool
            acquireTimeout: 30_000,
            // 30 s socket timeout
            timeout: 30_000,
            // keep trying if the DB is starting up
            reconnect: true,
          },

          // Optional: retry logic built-in (TypeORM 0.3+)
          retryAttempts: isProd ? 10 : 0,
          retryDelay: 5_000,
        };
      },
    }),

    /* ------------------- MAILER ------------------- */
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
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

    /* ------------------- SERVE STATIC (Vite) ------------------- */
    ServeStaticModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => {
        if (cfg.get<string>('NODE_ENV') !== 'production') return [];
        return [
          {
            rootPath: join(__dirname, '..', 'dist'), // Vite build folder
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