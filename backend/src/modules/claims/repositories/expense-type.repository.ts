import { Repository } from 'typeorm';
import { IGenericRepository } from '../../../common/base/IGenericRepository';
import { ExpenseType } from '../entities/expense-type.entity';

export class ExpenseTypeRepository extends IGenericRepository<ExpenseType> {
  constructor(repository: Repository<ExpenseType>) {
    super(repository);
  }

  async findActive(): Promise<ExpenseType[]> {
    return this.repository.find({
      where: { isActive: true },
      order: { name: 'ASC' },
    });
  }

  async findByName(name: string): Promise<ExpenseType | null> {
    return this.repository.findOne({
      where: { name },
    });
  }
}

