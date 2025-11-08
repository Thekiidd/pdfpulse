import { PdfService } from './pdf.service';
declare class CreateJobDto {
    file: any;
    jobType: 'compress' | 'word-pdf' | 'ocr';
}
export declare class PdfController {
    private readonly pdfService;
    constructor(pdfService: PdfService);
    createJob(req: any, body: CreateJobDto): Promise<{
        message: string;
        jobId: string;
    }>;
}
export {};
