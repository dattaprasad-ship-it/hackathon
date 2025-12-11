import { Attachment } from '../attachment.entity';
import { Claim } from '../claim.entity';

describe('Attachment Entity', () => {
  it('should create an attachment entity with all required fields', () => {
    const attachment = new Attachment();
    const claim = new Claim();
    
    attachment.claim = claim;
    attachment.originalFilename = 'receipt.pdf';
    attachment.storedFilename = 'uuid-receipt.pdf';
    attachment.fileSize = 102400; // 100 KB
    attachment.fileType = 'application/pdf';
    attachment.filePath = 'uploads/claims/uuid-receipt.pdf';

    expect(attachment.claim).toBe(claim);
    expect(attachment.originalFilename).toBe('receipt.pdf');
    expect(attachment.storedFilename).toBe('uuid-receipt.pdf');
    expect(attachment.fileSize).toBe(102400);
    expect(attachment.fileType).toBe('application/pdf');
    expect(attachment.filePath).toBe('uploads/claims/uuid-receipt.pdf');
  });

  it('should allow optional description to be undefined', () => {
    const attachment = new Attachment();
    const claim = new Claim();
    
    attachment.claim = claim;
    attachment.originalFilename = 'invoice.jpg';
    attachment.storedFilename = 'uuid-invoice.jpg';
    attachment.fileSize = 51200;
    attachment.fileType = 'image/jpeg';
    attachment.filePath = 'uploads/claims/uuid-invoice.jpg';

    expect(attachment.description).toBeUndefined();
  });

  it('should accept optional description', () => {
    const attachment = new Attachment();
    const claim = new Claim();
    
    attachment.claim = claim;
    attachment.originalFilename = 'receipt.pdf';
    attachment.storedFilename = 'uuid-receipt.pdf';
    attachment.fileSize = 102400;
    attachment.fileType = 'application/pdf';
    attachment.filePath = 'uploads/claims/uuid-receipt.pdf';
    attachment.description = 'Hotel receipt for accommodation';

    expect(attachment.description).toBe('Hotel receipt for accommodation');
  });

  it('should allow setting Audit base class properties', () => {
    const attachment = new Attachment();
    attachment.id = 'test-id';
    attachment.createdAt = new Date();
    attachment.updatedAt = new Date();
    
    expect(attachment.id).toBe('test-id');
    expect(attachment.createdAt).toBeInstanceOf(Date);
    expect(attachment.updatedAt).toBeInstanceOf(Date);
  });
});

