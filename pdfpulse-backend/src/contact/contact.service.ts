import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { CreateContactDto } from './dto/create-contact.dto';

@Injectable()
export class ContactService {
  constructor(
    private mailerService: MailerService,
    private configService: ConfigService,
  ) {}

  async sendContact(dto: CreateContactDto) {
    const recipient = this.configService.get('NODE_ENV') === 'production'
      ? this.configService.get('EMAIL_USER_PROD')
      : this.configService.get('EMAIL_USER');

    await this.mailerService.sendMail({
      to: recipient,
      replyTo: dto.email,
      subject: `Nuevo mensaje de ${dto.name}`,
      template: './contact',  // O usa html directo
      context: {
        name: dto.name,
        email: dto.email,
        message: dto.message,
      },
    });

    return { success: true, message: 'Mensaje enviado' };
  }
}