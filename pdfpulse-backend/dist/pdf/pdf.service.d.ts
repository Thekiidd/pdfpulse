export declare class PdfService {
    private readonly usersCollection;
    private readonly jobsCollection;
    checkAndDeductToken(userId: string): Promise<boolean>;
    createProcessingJob(userId: string, jobType: string, fileData: any): Promise<{
        jobId: string;
    }>;
}
