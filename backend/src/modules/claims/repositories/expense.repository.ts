import { Repository } from 'typeorm';
import { IGenericRepository } from '../../../common/base/IGenericRepository';
import { Expense } from '../entities/expense.entity';

export class ExpenseRepository extends IGenericRepository<Expense> {
  constructor(repository: Repository<Expense>) {
    super(repository);
  }

  async findByClaimId(claimId: string): Promise<Expense[]> {
    return this.repository.find({
      where: { claim: { id: claimId } },
      relations: ['expenseType'],
      order: { expenseDate: 'DESC' },
    });
  }

  async calculateTotalAmount(claimId: string): Promise<number> {
    const result = await this.repository
      .createQueryBuilder('expense')
      .select('SUM(expense.amount)', 'total')
      .where('expense.claim.id = :claimId', { claimId })
      .getRawOne();

    return result?.total ? parseFloat(result.total) : 0;
  }
}

