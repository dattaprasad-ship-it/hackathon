import { Repository } from 'typeorm';
import { AttachmentRepository } from '../attachment.repository';
import { Attachment } from '../../entities/attachment.entity';
import { when } from 'jest-when';

describe('AttachmentRepository', () => {
  let repository: AttachmentRepository;
  let mockRepository: jest.Mocked<Repository<Attachment>>;

  beforeEach(() => {
    mockRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
    } as any;

    repository = new AttachmentRepository(mockRepository);
  });

  describe('findByClaimId', () => {
    it('should find all attachments for a claim', async () => {
      const mockAttachments = [
        { id: '1', originalFilename: 'receipt1.pdf', claim: { id: 'claim-1' } } as Attachment,
        { id: '2', originalFilename: 'receipt2.jpg', claim: { id: 'claim-1' } } as Attachment,
      ];

      when(mockRepository.find).calledWith({
        where: { claim: { id: 'claim-1' } },
        order: { createdAt: 'DESC' },
      }).mockResolvedValue(mockAttachments);

      const result = await repository.findByClaimId('claim-1');

      expect(result).toEqual(mockAttachments);
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { claim: { id: 'claim-1' } },
        order: { createdAt: 'DESC' },
      });
    });
  });

  describe('findByStoredFilename', () => {
    it('should find attachment by stored filename', async () => {
      const mockAttachment = {
        id: '1',
        storedFilename: 'uuid-receipt.pdf',
        originalFilename: 'receipt.pdf',
      } as Attachment;

      when(mockRepository.findOne).calledWith({
        where: { storedFilename: 'uuid-receipt.pdf' },
        relations: ['claim'],
      }).mockResolvedValue(mockAttachment);

      const result = await repository.findByStoredFilename('uuid-receipt.pdf');

      expect(result).toEqual(mockAttachment);
    });
  });
});

