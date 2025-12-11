import { Repository, DeepPartial, ObjectLiteral } from 'typeorm';
export declare abstract class IGenericRepository<T extends ObjectLiteral> {
    protected readonly repository: Repository<T>;
    constructor(repository: Repository<T>);
    findById(id: string): Promise<T | null>;
    findAll(): Promise<T[]>;
    create(entity: DeepPartial<T>): Promise<T>;
    update(id: string, entity: DeepPartial<T>): Promise<void>;
    delete(id: string): Promise<void>;
}
//# sourceMappingURL=IGenericRepository.d.ts.map