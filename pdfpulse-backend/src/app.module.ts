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
    
    // TypeORM MySQL (con logging detallado y manejo de errores)
    TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    useFactory: (configService: ConfigService) => {
        const isProd = configService.get('NODE_ENV') === 'production';

        const dbConfig = {
        type: 'mysql' as const,
        host: isProd ? configService.get('DB_HOST_PROD') : configService.get('DB_HOST'),
        port: isProd ? +configService.get('DB_PORT_PROD') : +configService.get('DB_PORT'),
        username: isProd ? configService.get('DB_USER_PROD') : configService.get('DB_USER'),
        password: isProd ? configService.get('DB_PASSWORD_PROD') : configService.get('DB_PASSWORD'),
        database: isProd ? configService.get('DB_NAME_PROD') : configService.get('DB_NAME'),
        entities: [CounterEntity, ProcesadosEntity],
        synchronize: !isProd,
        logging: true, // ← MUESTRA TODOS LOS QUERIES Y ERRORES EN CONSOLA
        ssl: isProd ? { rejectUnauthorized: false } : false, // ← SSL para Railway
        // Timeouts altos para ETIMEDOUT
        extra: {
            connectionLimit: 10,
            acquireTimeout: 120000, // 2 minutos
            timeout: 120000, // 2 minutos
            reconnect: true, // Reintenta conexión
        },
        retryAttempts: isProd ? 10 : 3,
        retryDelay: 5000, // 5 segundos entre reintentos
        };

        // LOG DETALLADO EN CONSOLA (para debug en Render)
        console.log('🚀 DB CONFIG:', {
        entorno: isProd ? 'PRODUCCIÓN (Railway)' : 'DESARROLLO (XAMPP)',
        host: dbConfig.host,
        puerto: dbConfig.port,
        base: dbConfig.database,
        usuario: dbConfig.username?.substring(0, 3) + '...', // Oculta password
        ssl: dbConfig.ssl,
        retryAttempts: dbConfig.retryAttempts,
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
