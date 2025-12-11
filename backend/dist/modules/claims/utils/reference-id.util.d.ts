import { ClaimRepository } from '../repositories/claim.repository';
/**
 * Generates a unique reference ID in format YYYYMMDDXXXXXXX
 * where YYYYMMDD is the current date and XXXXXXX is a 7-digit sequence number
 */
export declare class ReferenceIdUtil {
    /**
     * Generate a unique reference ID for a claim
     * Format: YYYYMMDDXXXXXXX (date + 7-digit sequence)
     */
    static generateReferenceId(claimRepository: ClaimRepository): Promise<string>;
    private static generateReferenceIdWithRetry;
}
//# sourceMappingURL=reference-id.util.d.ts.map