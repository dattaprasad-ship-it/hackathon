import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Audit } from '../../../common/base/audit.entity';
import { Employee } from './employee.entity';

@Entity('sub_units')
export class SubUnit extends Audit {
  @Column({ name: 'name', unique: true })
  name: string;

  @ManyToOne(() => SubUnit, { nullable: true })
  @JoinColumn({ name: 'parent_id' })
  parent?: SubUnit;

  @OneToMany(() => Employee, (employee) => employee.subUnit)
  employees?: Employee[];
}

