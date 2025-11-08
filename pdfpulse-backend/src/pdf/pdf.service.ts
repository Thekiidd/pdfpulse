import { Injectable, BadRequestException } from '@nestjs/common';
import { firestore } from '../firebase-admin.config';
import * as admin from 'firebase-admin';

@Injectable()
export class PdfService {
  private readonly usersCollection = firestore.collection('users');
  private readonly jobsCollection = firestore.collection('jobs');

  async checkAndDeductToken(userId: string): Promise<boolean> {
    const userRef = this.usersCollection.doc(userId);

    return firestore.runTransaction(async (transaction) => {
      const userDoc = await transaction.get(userRef);

      if (!userDoc.exists) {
        throw new BadRequestException('Usuario no encontrado en la base de datos.');
      }

      const userData = userDoc.data()!;
      const remainingTokens = userData.tokens?.remaining || 0;

      if (remainingTokens <= 0) {
        return false;
      }

      // Descontar 1 token
      transaction.update(userRef, {
        'tokens.remaining': remainingTokens - 1,
      });

      return true;
    });
  }

  async createProcessingJob(userId: string, jobType: string, fileData: any): Promise<{ jobId: string }> {
    // Aquí es donde se conectaría la lógica de BullMQ/Redis real

    const jobId = `${jobType}-${Date.now()}`;

    // Crea un documento en Firestore para que el Frontend pueda monitorear
    await this.jobsCollection.doc(jobId).set({
      userId: userId,
      status: 'QUEUED',
      jobType: jobType,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    console.log(`[JOB CREADO] Job ID: ${jobId} para User: ${userId}`);
    return { jobId };
  }
}