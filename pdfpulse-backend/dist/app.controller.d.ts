import { ConfigService } from '@nestjs/config';
import { MailerService } from '@nestjs-modules/mailer';
export declare class AppController {
    private configService;
    private mailerService;
    constructor(configService: ConfigService, mailerService: MailerService);
    getTest(): {
        message: string;
        env: any;
    };
    testSmtp(): Promise<{
        success: boolean;
        message: string;
    }>;
}
