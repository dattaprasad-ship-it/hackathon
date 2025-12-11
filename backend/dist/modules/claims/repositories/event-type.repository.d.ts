import { Repository } from 'typeorm';
import { IGenericRepository } from '../../../common/base/IGenericRepository';
import { EventType } from '../entities/event-type.entity';
export declare class EventTypeRepository extends IGenericRepository<EventType> {
    constructor(repository: Repository<EventType>);
    findActive(): Promise<EventType[]>;
    findByName(name: string): Promise<EventType | null>;
}
//# sourceMappingURL=event-type.repository.d.ts.map