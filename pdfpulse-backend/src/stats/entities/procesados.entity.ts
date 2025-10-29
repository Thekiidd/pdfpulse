// src/stats/entities/procesados.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('procesados')
export class ProcesadosEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  tipo: string;

  @Column({ type: 'varchar', nullable: true, default: null })
  hash: string | null;
}