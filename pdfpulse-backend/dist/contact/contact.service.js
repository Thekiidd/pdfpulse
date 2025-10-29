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
exports.ContactService = void 0;
const common_1 = require("@nestjs/common");
const mailer_1 = require("@nestjs-modules/mailer");
const config_1 = require("@nestjs/config");
let ContactService = class ContactService {
    mailerService;
    configService;
    constructor(mailerService, configService) {
        this.mailerService = mailerService;
        this.configService = configService;
    }
    async sendContact(dto) {
        const recipient = this.configService.get('NODE_ENV') === 'production'
            ? this.configService.get('EMAIL_USER_PROD')
            : this.configService.get('EMAIL_USER');
        await this.mailerService.sendMail({
            to: recipient,
            replyTo: dto.email,
            subject: `Nuevo mensaje de ${dto.name}`,
            template: './contact',
            context: {
                name: dto.name,
                email: dto.email,
                message: dto.message,
            },
        });
        return { success: true, message: 'Mensaje enviado' };
    }
};
exports.ContactService = ContactService;
exports.ContactService = ContactService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [mailer_1.MailerService,
        config_1.ConfigService])
], ContactService);
//# sourceMappingURL=contact.service.js.map