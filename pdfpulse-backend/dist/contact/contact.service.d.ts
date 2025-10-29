import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { CreateContactDto } from './dto/create-contact.dto';
export declare class ContactService {
    private mailerService;
    private configService;
    constructor(mailerService: MailerService, configService: ConfigService);
    sendContact(dto: CreateContactDto): Promise<{
        success: boolean;
        message: string;
    }>;
}
