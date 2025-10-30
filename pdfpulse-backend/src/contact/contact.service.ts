import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateContactDto } from './dto/create-contact.dto';
import { Resend } from 'resend'; // <-- 1. Importamos Resend

@Injectable()
export class ContactService {
  private readonly resend: Resend;
  private readonly logger = new Logger(ContactService.name);
  
  // El email donde RECIBIRÁS los correos
  private readonly toEmail = 'hola@pdfpulse.online'; 
  
  // El email verificado en Resend (de donde ENVÍAS)
  private readonly fromEmail = 'contact@pdfpulse.online'; 

  constructor(
    private readonly configService: ConfigService,
    // private mailerService: MailerService, // <-- 2. Eliminamos MailerService
  ) {
    // 3. Inicializamos Resend con la API Key
    this.resend = new Resend(this.configService.get('RESEND_API_KEY'));
  }

  async sendContact(dto: CreateContactDto) {
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

      // 4. Usamos Resend en lugar de MailerService
      const { data, error } = await this.resend.emails.send({
        from: `PDFPulse Contacto <${this.fromEmail}>`,
        to: [this.toEmail], // Lo envías a tu propio correo
        subject: subject,
        text: textBody, // Usamos 'text' para un email simple
        replyTo: email, // Para que puedas darle "Responder" al usuario
      });

      if (error) {
        this.logger.error('Error al enviar email con Resend:', error);
        throw new Error(error.message);
      }

      this.logger.log('Email enviado exitosamente:', data.id);
      return { success: true, message: 'Mensaje enviado' };

    } catch (error) {
      this.logger.error('Excepción al enviar email:', error.message);
      return { success: false, message: `Error del servidor: ${error.message}` };
    }
  }
}