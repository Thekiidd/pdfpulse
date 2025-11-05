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
var ContactService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const resend_1 = require("resend");
let ContactService = ContactService_1 = class ContactService {
    configService;
    resend;
    logger = new common_1.Logger(ContactService_1.name);
    toEmail = 'hola@pdfpulse.online';
    fromEmail = 'contact@pdfpulse.online';
    constructor(configService) {
        this.configService = configService;
        this.resend = new resend_1.Resend(this.configService.get('RESEND_API_KEY'));
    }
    async sendContact(dto) {
        const { name, email, message } = dto;
        const subject = `Nuevo Mensaje de Contacto de: ${name}`;
        const textBody = `
      Has recibido un nuevo mensaje desde pdfpulse.online:
      
      Nombre: ${name}
      Email: ${email}
      
      Mensaje:
      ${message}
    `;
        try {
            this.logger.log(`Enviando email de ${email} a ${this.toEmail} via Resend...`);
            const { data, error } = await this.resend.emails.send({
                from: `PDFPulse Contacto <${this.fromEmail}>`,
                to: [this.toEmail],
                subject: subject,
                text: textBody,
                replyTo: email,
            });
            if (error) {
                this.logger.error('Error al enviar email con Resend:', error);
                throw new Error(error.message);
            }
            this.logger.log('Email enviado exitosamente:', data.id);
            return { success: true, message: 'Mensaje enviado' };
        }
        catch (error) {
            this.logger.error('Excepción al enviar email:', error.message);
            return { success: false, message: `Error del servidor: ${error.message}` };
        }
    }
};
exports.ContactService = ContactService;
exports.ContactService = ContactService = ContactService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], ContactService);
//# sourceMappingURL=contact.service.js.map