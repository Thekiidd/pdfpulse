import { Controller, Post, UseGuards, Req, Body, ForbiddenException, HttpCode, HttpStatus } from '@nestjs/common';
import { PdfService } from './pdf.service';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';

class CreateJobDto {
  // Nota: En producción, recibirías la URL de S3/GCS, no el archivo Buffer completo.
  file: any; 
  jobType: 'compress' | 'word-pdf' | 'ocr';
}

@Controller('pdf') 
export class PdfController {
  constructor(private readonly pdfService: PdfService) {}

  @UseGuards(FirebaseAuthGuard) 
  @Post('create-job') 
  @HttpCode(HttpStatus.ACCEPTED)
  async createJob(@Req() req, @Body() body: CreateJobDto) {
    const userId = req.user.uid; 

    const tokenDeducted = await this.pdfService.checkAndDeductToken(userId);

    if (!tokenDeducted) {
      throw new ForbiddenException('Saldo insuficiente. Compra más tokens para usar esta función.');
    }

    const jobResult = await this.pdfService.createProcessingJob(
      userId,
      body.jobType,
      body.file 
    );

    return { 
      message: 'Trabajo aceptado y en cola. Monitorea el estado con el Job ID.', 
      jobId: jobResult.jobId 
    };
  }
}