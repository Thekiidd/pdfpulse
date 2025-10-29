"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const serve_static_1 = require("@nestjs/serve-static");
const path_1 = require("path");
const mailer_1 = require("@nestjs-modules/mailer");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const contact_module_1 = require("./contact/contact.module");
const stats_module_1 = require("./stats/stats.module");
const counter_entity_1 = require("./stats/entities/counter.entity");
const procesados_entity_1 = require("./stats/entities/procesados.entity");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: (configService) => {
                    const isProd = configService.get('NODE_ENV') === 'production';
                    return {
                        type: 'mysql',
                        host: isProd ? configService.get('DB_HOST_PROD') : configService.get('DB_HOST'),
                        port: isProd ? +configService.get('DB_PORT_PROD') : +configService.get('DB_PORT'),
                        username: isProd ? configService.get('DB_USER_PROD') : configService.get('DB_USER'),
                        password: isProd ? configService.get('DB_PASSWORD_PROD') : configService.get('DB_PASSWORD'),
                        database: isProd ? configService.get('DB_NAME_PROD') : configService.get('DB_NAME'),
                        entities: [counter_entity_1.CounterEntity, procesados_entity_1.ProcesadosEntity],
                        synchronize: !isProd,
                        ssl: isProd ? { rejectUnauthorized: false } : false,
                    };
                },
                inject: [config_1.ConfigService],
            }),
            mailer_1.MailerModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: async (configService) => {
                    const isProd = configService.get('NODE_ENV') === 'production';
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
                inject: [config_1.ConfigService],
            }),
            serve_static_1.ServeStaticModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: (configService) => {
                    const isProd = configService.get('NODE_ENV') === 'production';
                    if (!isProd)
                        return [];
                    return [
                        {
                            rootPath: (0, path_1.join)(__dirname, '..', 'dist'),
                            exclude: ['/api/*'],
                        },
                    ];
                },
                inject: [config_1.ConfigService],
            }),
            contact_module_1.ContactModule,
            stats_module_1.StatsModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map