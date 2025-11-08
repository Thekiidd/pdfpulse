"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const helmet_1 = __importDefault(require("helmet"));
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const configService = app.get(config_1.ConfigService);
    app.use((0, helmet_1.default)());
    const isProd = configService.get('NODE_ENV') === 'production';
    const frontendUrl = isProd ? 'https://pdfpulse.online' : 'http://localhost:5173';
    app.enableCors({
        origin: [frontendUrl, 'https://www.pdfpulse.online'],
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
    });
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new common_1.ValidationPipe());
    const port = configService.get('PORT') || 5000;
    await app.listen(port);
    console.log(`🚀 Servidor NestJS corriendo en: http://localhost:${port}`);
}
bootstrap();
//# sourceMappingURL=main.js.map