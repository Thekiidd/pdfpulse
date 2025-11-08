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
const throttler_1 = require("@nestjs/throttler");
const core_1 = require("@nestjs/core");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const contact_module_1 = require("./contact/contact.module");
const stats_module_1 = require("./stats/stats.module");
const counter_entity_1 = require("./stats/entities/counter.entity");
const procesados_entity_1 = require("./stats/entities/procesados.entity");
const pdf_module_1 = require("./pdf/pdf.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            throttler_1.ThrottlerModule.forRoot([{
                    ttl: 60000,
                    limit: 10,
                }]),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: (configService) => {
                    const isProd = configService.get('NODE_ENV') === 'production';
                    const dbConfig = {
                        type: 'mysql',
                        entities: [counter_entity_1.CounterEntity, procesados_entity_1.ProcesadosEntity],
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
                    }
                    else {
                        dbConfig.host = configService.get('DB_HOST') || 'localhost';
                        dbConfig.port = +configService.get('DB_PORT') || 3306;
                        dbConfig.username = configService.get('DB_USER') || 'root';
                        dbConfig.password = configService.get('DB_PASSWORD') || '';
                        dbConfig.database = configService.get('DB_NAME') || 'pdfpulse_dev';
                    }
                    return dbConfig;
                },
                inject: [config_1.ConfigService],
            }),
            contact_module_1.ContactModule,
            stats_module_1.StatsModule,
            pdf_module_1.PdfModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [
            app_service_1.AppService,
            {
                provide: core_1.APP_GUARD,
                useClass: throttler_1.ThrottlerGuard,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map