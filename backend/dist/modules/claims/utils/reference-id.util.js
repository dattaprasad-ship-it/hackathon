"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReferenceIdUtil = void 0;
/**
 * Generates a unique reference ID in format YYYYMMDDXXXXXXX
 * where YYYYMMDD is the current date and XXXXXXX is a 7-digit sequence number
 */
class ReferenceIdUtil {
    /**
     * Generate a unique reference ID for a claim
     * Format: YYYYMMDDXXXXXXX (date + 7-digit sequence)
     */
    static async generateReferenceId(claimRepository) {
        const today = new Date();
        const datePrefix = today.toISOString().slice(0, 10).replace(/-/g, ''); // YYYYMMDD
        // Find all claims with reference IDs starting with today's date prefix
        // We'll search with a prefix pattern and get the highest sequence
        const existingClaims = await claimRepository.findWithFilters({
            referenceId: datePrefix,
            page: 1,
            limit: 100, // Get enough to find the max sequence
            sortBy: 'referenceId',
            sortOrder: 'DESC',
        });
        let sequence = 1;
        // Find the highest sequence number for today
        for (const claim of existingClaims.claims) {
            if (claim.referenceId && claim.referenceId.startsWith(datePrefix)) {
                const sequencePart = claim.referenceId.slice(8); // Get the 7-digit sequence part
                const lastSequence = parseInt(sequencePart, 10);
                if (!isNaN(lastSequence) && lastSequence >= sequence) {
                    sequence = lastSequence + 1;
                }
            }
        }
        // Ensure sequence doesn't exceed 7 digits (max 9999999)
        if (sequence > 9999999) {
            throw new Error('Maximum sequence number reached for today');
        }
        // Ensure sequence is 7 digits, pad with zeros
        const sequenceStr = sequence.toString().padStart(7, '0');
        const referenceId = `${datePrefix}${sequenceStr}`;
        // Verify uniqueness (retry if collision - should be rare)
        const existing = await claimRepository.findByReferenceId(referenceId);
        if (existing) {
            // Retry with incremented sequence (max 10 retries to avoid infinite loop)
            return this.generateReferenceIdWithRetry(claimRepository, datePrefix, sequence + 1, 10);
        }
        return referenceId;
    }
    static async generateReferenceIdWithRetry(claimRepository, datePrefix, startSequence, maxRetries) {
        if (maxRetries <= 0) {
            throw new Error('Failed to generate unique reference ID after multiple retries');
        }
        if (startSequence > 9999999) {
            throw new Error('Maximum sequence number reached for today');
        }
        const sequenceStr = startSequence.toString().padStart(7, '0');
        const referenceId = `${datePrefix}${sequenceStr}`;
        const existing = await claimRepository.findByReferenceId(referenceId);
        if (existing) {
            return this.generateReferenceIdWithRetry(claimRepository, datePrefix, startSequence + 1, maxRetries - 1);
        }
        return referenceId;
    }
}
exports.ReferenceIdUtil = ReferenceIdUtil;
//# sourceMappingURL=reference-id.util.js.map