import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailerService } from '@nestjs-modules/mailer';

@Controller()
export class AppController {
  constructor(
    private configService: ConfigService,
    private mailerService: MailerService,
  ) {}

  @Get('test')
  getTest() {
    return {
      message: 'PDFPulse NestJS API ON ✅',
      env: this.configService.get('NODE_ENV'),
    };
  }

  @Get('test-smtp')
  async testSmtp() {
    await this.mailerService.sendMail({
      to: this.configService.get('EMAIL_USER'),
      subject: 'Test SMTP NestJS ✅',
      text: '¡SMTP funciona!',
    });
    return { success: true, message: 'SMTP OK' };
  }
}