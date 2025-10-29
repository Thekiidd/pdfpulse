import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('contador')
export class CounterEntity {
  @PrimaryColumn()
  id: number = 1;

  @Column({ default: 0 })
  total: number;
}