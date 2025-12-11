import { Repository } from 'typeorm';
import { IGenericRepository } from '../../../common/base/IGenericRepository';
import { EventType } from '../entities/event-type.entity';

export class EventTypeRepository extends IGenericRepository<EventType> {
  constructor(repository: Repository<EventType>) {
    super(repository);
  }

  async findActive(): Promise<EventType[]> {
    return this.repository.find({
      where: { isActive: true },
      order: { name: 'ASC' },
    });
  }

  async findByName(name: string): Promise<EventType | null> {
    return this.repository.findOne({
      where: { name },
    });
  }
}

