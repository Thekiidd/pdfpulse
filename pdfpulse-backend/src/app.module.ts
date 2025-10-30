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
    
    // TypeORM MySQL
    TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    useFactory: (configService: ConfigService) => {
        const isProd = configService.get('NODE_ENV') === 'production';

        const dbConfig: any = {
        type: 'mysql' as const,
        host: isProd ? configService.get('DB_HOST_PROD') : configService.get('DB_HOST'),
        port: isProd ? +configService.get('DB_PORT_PROD') : +configService.get('DB_PORT'),
        username: isProd ? configService.get('DB_USER_PROD') : configService.get('DB_USER'),
        password: isProd ? configService.get('DB_PASSWORD_PROD') : configService.get('DB_PASSWORD'),
        database: isProd ? configService.get('DB_NAME_PROD') : configService.get('DB_NAME'),
        entities: [CounterEntity, ProcesadosEntity],
        synchronize: !isProd,
        logging: true,
        ssl: isProd ? { rejectUnauthorized: false } : false,
        retryAttempts: isProd ? 10 : 3,
        retryDelay: 3000,
        };

        // LOG DETALLADO
        console.log('DB CONEXIÓN:', {
        entorno: isProd ? 'PRODUCCIÓN (Railway)' : 'DESARROLLO (XAMPP)',
        host: dbConfig.host,
        puerto: dbConfig.port,
        base: dbConfig.database,
        usuario: dbConfig.username,
        ssl: dbConfig.ssl,
        });

        return dbConfig;
    },
    inject: [ConfigService],
    }),

    // Mailer IONOS (corregido)
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const isProd = configService.get('NODE_ENV') === 'production';

        return {
          transport: {
            host: 'smtp.ionos.mx', // Cambia dominio si tu cuenta es .com o .es
            port: 465,             // ✅ Puerto SSL
            secure: true,          // ✅ Usa TLS desde el inicio
            auth: {
              user: configService.get('EMAIL_USER'),
              pass: configService.get('EMAIL_PASS'),
            },
            tls: {
              rejectUnauthorized: false, // ✅ Evita error "self-signed certificate"
            },
          },
          defaults: {
            from: `"PDFPulse Contacto" <${configService.get('EMAIL_USER')}>`,
          },
        };
      },
      inject: [ConfigService],
    }),

    // Serve Vite SPA (solo prod)
    ServeStaticModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const isProd = configService.get('NODE_ENV') === 'production';

        if (!isProd) return []; // No sirve nada en dev

        return [
          {
            rootPath: join(__dirname, '..', 'dist'), // Vite build
            exclude: ['/api/*'], // ✅ Corregido: formato compatible
          },
        ];
      },
      inject: [ConfigService],
    }),

    ContactModule,
    StatsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
