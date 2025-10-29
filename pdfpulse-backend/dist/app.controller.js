"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const mailer_1 = require("@nestjs-modules/mailer");
let AppController = class AppController {
    configService;
    mailerService;
    constructor(configService, mailerService) {
        this.configService = configService;
        this.mailerService = mailerService;
    }
    getTest() {
        return {
            message: 'PDFPulse NestJS API ON ✅',
            env: this.configService.get('NODE_ENV'),
        };
    }
    async testSmtp() {
        await this.mailerService.sendMail({
            to: this.configService.get('EMAIL_USER'),
            subject: 'Test SMTP NestJS ✅',
            text: '¡SMTP funciona!',
        });
        return { success: true, message: 'SMTP OK' };
    }
};
exports.AppController = AppController;
__decorate([
    (0, common_1.Get)('test'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AppController.prototype, "getTest", null);
__decorate([
    (0, common_1.Get)('test-smtp'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "testSmtp", null);
exports.AppController = AppController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        mailer_1.MailerService])
], AppController);
//# sourceMappingURL=app.controller.js.map