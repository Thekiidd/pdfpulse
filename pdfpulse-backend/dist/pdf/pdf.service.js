"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.PdfService = void 0;
const common_1 = require("@nestjs/common");
const firebase_admin_config_1 = require("../firebase-admin.config");
const admin = __importStar(require("firebase-admin"));
let PdfService = class PdfService {
    usersCollection = firebase_admin_config_1.firestore.collection('users');
    jobsCollection = firebase_admin_config_1.firestore.collection('jobs');
    async checkAndDeductToken(userId) {
        const userRef = this.usersCollection.doc(userId);
        return firebase_admin_config_1.firestore.runTransaction(async (transaction) => {
            const userDoc = await transaction.get(userRef);
            if (!userDoc.exists) {
                throw new common_1.BadRequestException('Usuario no encontrado en la base de datos.');
            }
            const userData = userDoc.data();
            const remainingTokens = userData.tokens?.remaining || 0;
            if (remainingTokens <= 0) {
                return false;
            }
            transaction.update(userRef, {
                'tokens.remaining': remainingTokens - 1,
            });
            return true;
        });
    }
    async createProcessingJob(userId, jobType, fileData) {
        const jobId = `${jobType}-${Date.now()}`;
        await this.jobsCollection.doc(jobId).set({
            userId: userId,
            status: 'QUEUED',
            jobType: jobType,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        console.log(`[JOB CREADO] Job ID: ${jobId} para User: ${userId}`);
        return { jobId };
    }
};
exports.PdfService = PdfService;
exports.PdfService = PdfService = __decorate([
    (0, common_1.Injectable)()
], PdfService);
//# sourceMappingURL=pdf.service.js.map