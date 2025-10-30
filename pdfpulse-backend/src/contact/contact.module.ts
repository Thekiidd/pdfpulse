import { Module } from '@nestjs/common';
import { ContactController } from './contact.controller';
import { ContactService } from './contact.service';
// import { MailerModule } from '@nestjs-modules/mailer'; // <-- ELIMINADO
// import { ConfigModule } from '@nestjs/config'; // <-- ELIMINADO

@Module({
  imports: [
    // MailerModule, // <-- ELIMINADO
    // ConfigModule, // <-- ELIMINADO
  ],
  controllers: [ContactController],
  providers: [ContactService],
})
export class ContactModule {}