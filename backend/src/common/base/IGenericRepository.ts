import { Repository, FindOptionsWhere, FindManyOptions, DeepPartial, ObjectLiteral } from 'typeorm';

export abstract class IGenericRepository<T extends ObjectLiteral> {
  constructor(protected readonly repository: Repository<T>) {}

  async findById(id: string): Promise<T | null> {
    return this.repository.findOne({
      where: { id } as unknown as FindOptionsWhere<T>,
    } as FindManyOptions<T>);
  }

  async findAll(): Promise<T[]> {
    return this.repository.find();
  }

  async create(entity: DeepPartial<T>): Promise<T> {
    const newEntity = this.repository.create(entity);
    return this.repository.save(newEntity);
  }

  async update(id: string, entity: DeepPartial<T>): Promise<void> {
    await this.repository.update(id, entity as any);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}

