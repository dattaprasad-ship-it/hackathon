import { Repository } from 'typeorm';
import { EventTypeRepository } from '../event-type.repository';
import { EventType } from '../../entities/event-type.entity';
import { when } from 'jest-when';

describe('EventTypeRepository', () => {
  let repository: EventTypeRepository;
  let mockRepository: jest.Mocked<Repository<EventType>>;

  beforeEach(() => {
    mockRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
    } as any;

    repository = new EventTypeRepository(mockRepository);
  });

  describe('findActive', () => {
    it('should find all active event types', async () => {
      const mockEventTypes = [
        { id: '1', name: 'Travel Allowance', isActive: true } as EventType,
        { id: '2', name: 'Medical Reimbursement', isActive: true } as EventType,
      ];

      when(mockRepository.find).calledWith({
        where: { isActive: true },
        order: { name: 'ASC' },
      }).mockResolvedValue(mockEventTypes);

      const result = await repository.findActive();

      expect(result).toEqual(mockEventTypes);
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { isActive: true },
        order: { name: 'ASC' },
      });
    });
  });

  describe('findByName', () => {
    it('should find event type by name', async () => {
      const mockEventType = {
        id: '1',
        name: 'Travel Allowance',
        isActive: true,
      } as EventType;

      when(mockRepository.findOne).calledWith({
        where: { name: 'Travel Allowance' },
      }).mockResolvedValue(mockEventType);

      const result = await repository.findByName('Travel Allowance');

      expect(result).toEqual(mockEventType);
    });
  });
});

