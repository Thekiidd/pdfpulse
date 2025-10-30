import { ConfigService } from '@nestjs/config';
import { CreateContactDto } from './dto/create-contact.dto';
export declare class ContactService {
    private readonly configService;
    private readonly resend;
    private readonly logger;
    private readonly toEmail;
    private readonly fromEmail;
    constructor(configService: ConfigService);
    sendContact(dto: CreateContactDto): Promise<{
        success: boolean;
        message: string;
    }>;
}
