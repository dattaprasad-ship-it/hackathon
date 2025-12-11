import { Repository, FindOptionsWhere } from 'typeorm';
import { IGenericRepository } from '../../../common/base/IGenericRepository';
import { CustomField } from '../entities/custom-field.entity';

export class CustomFieldRepository extends IGenericRepository<CustomField> {
  constructor(repository: Repository<CustomField>) {
    super(repository);
  }

  async findByFieldName(fieldName: string): Promise<CustomField | null> {
    return this.repository.findOne({
      where: {
        fieldName,
        isDeleted: false,
      } as FindOptionsWhere<CustomField>,
    });
  }

  async findActiveFields(): Promise<CustomField[]> {
    return this.repository.find({
      where: { isDeleted: false } as FindOptionsWhere<CustomField>,
      order: { fieldName: 'ASC' },
    });
  }

  async countActiveFields(): Promise<number> {
    return this.repository.count({
      where: { isDeleted: false } as FindOptionsWhere<CustomField>,
    });
  }

  async findByScreen(screen: string): Promise<CustomField[]> {
    return this.repository.find({
      where: {
        screen,
        isDeleted: false,
      } as FindOptionsWhere<CustomField>,
      order: { fieldName: 'ASC' },
    });
  }

  async softDelete(id: string, updatedBy?: string): Promise<void> {
    await this.repository.update(id, { isDeleted: true, updatedBy } as Partial<CustomField>);
  }
}

