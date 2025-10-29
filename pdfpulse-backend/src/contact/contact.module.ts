import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { ContactController } from './contact.controller';
import { ContactService } from './contact.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MailerModule,
    ConfigModule,
  ],
  controllers: [ContactController],
  providers: [ContactService],
})
export class ContactModule {}