import { AttachmentsService } from '../attachments.service';
import { AttachmentRepository } from '../../repositories/attachment.repository';
import { ClaimRepository } from '../../repositories/claim.repository';
import { Attachment } from '../../entities/attachment.entity';
import { Claim } from '../../entities/claim.entity';
import { BusinessException } from '../../../../common/exceptions/business.exception';
import { when } from 'jest-when';
import * as fs from 'fs';
import * as path from 'path';

jest.mock('fs');
jest.mock('path');

describe('AttachmentsService', () => {
  let service: AttachmentsService;
  let mockAttachmentRepository: jest.Mocked<AttachmentRepository>;
  let mockClaimRepository: jest.Mocked<ClaimRepository>;

  const mockFile = {
    originalname: 'receipt.pdf',
    mimetype: 'application/pdf',
    size: 51200, // 50 KB
    buffer: Buffer.from('fake file content'),
  } as Express.Multer.File;

  beforeEach(() => {
    mockAttachmentRepository = {
      findById: jest.fn(),
      findByClaimId: jest.fn(),
      findByStoredFilename: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
    } as any;

    mockClaimRepository = {
      findByIdWithRelations: jest.fn(),
    } as any;

    service = new AttachmentsService(mockAttachmentRepository, mockClaimRepository);
  });

  describe('upload', () => {
    it('should upload an attachment successfully', async () => {
      const claimId = 'claim-1';
      const mockClaim = {
        id: claimId,
        status: 'Initiated',
      } as Claim;

      const mockAttachment = {
        id: 'att-1',
        originalFilename: 'receipt.pdf',
        storedFilename: 'uuid-receipt.pdf',
        fileSize: 51200,
        fileType: 'application/pdf',
        filePath: 'uploads/claims/uuid-receipt.pdf',
      } as Attachment;

      when(mockClaimRepository.findByIdWithRelations).calledWith(claimId).mockResolvedValue(mockClaim);
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.writeFileSync as jest.Mock).mockReturnValue(undefined);
      (path.join as jest.Mock).mockReturnValue('uploads/claims/uuid-receipt.pdf');
      when(mockAttachmentRepository.create).calledWith(expect.objectContaining({
        claim: mockClaim,
        originalFilename: 'receipt.pdf',
        fileSize: 51200,
        fileType: 'application/pdf',
      })).mockResolvedValue(mockAttachment);

      const result = await service.upload(claimId, mockFile, 'Receipt for travel');

      expect(result).toEqual(mockAttachment);
      expect(fs.writeFileSync).toHaveBeenCalled();
    });

    it('should throw error if file size exceeds 1MB', async () => {
      const largeFile = {
        ...mockFile,
        size: 1048577, // 1MB + 1 byte
      } as Express.Multer.File;

      const mockClaim = {
        id: 'claim-1',
        status: 'Initiated',
      } as Claim;

      when(mockClaimRepository.findByIdWithRelations).calledWith('claim-1').mockResolvedValue(mockClaim);

      await expect(service.upload('claim-1', largeFile)).rejects.toThrow(BusinessException);
      await expect(service.upload('claim-1', largeFile)).rejects.toThrow('File size cannot exceed 1MB');
    });

    it('should throw error if file type is not allowed', async () => {
      const invalidFile = {
        ...mockFile,
        mimetype: 'application/x-executable',
      } as Express.Multer.File;

      const mockClaim = {
        id: 'claim-1',
        status: 'Initiated',
      } as Claim;

      when(mockClaimRepository.findByIdWithRelations).calledWith('claim-1').mockResolvedValue(mockClaim);

      await expect(service.upload('claim-1', invalidFile)).rejects.toThrow(BusinessException);
      await expect(service.upload('claim-1', invalidFile)).rejects.toThrow('File type not allowed');
    });
  });

  describe('delete', () => {
    it('should delete an attachment and its file', async () => {
      const attachmentId = 'att-1';
      const mockAttachment = {
        id: attachmentId,
        filePath: 'uploads/claims/uuid-receipt.pdf',
        claim: { id: 'claim-1', status: 'Initiated' } as Claim,
      } as Attachment;

      when(mockAttachmentRepository.findById).calledWith(attachmentId).mockResolvedValue(mockAttachment);
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.unlinkSync as jest.Mock).mockReturnValue(undefined);
      when(mockAttachmentRepository.delete).calledWith(attachmentId).mockResolvedValue(undefined);

      await service.delete(attachmentId);

      expect(fs.unlinkSync).toHaveBeenCalledWith('uploads/claims/uuid-receipt.pdf');
      expect(mockAttachmentRepository.delete).toHaveBeenCalledWith(attachmentId);
    });
  });
});

