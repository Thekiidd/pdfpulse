// src/stats/stats.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CounterEntity } from './entities/counter.entity';
import { ProcesadosEntity } from './entities/procesados.entity';

@Injectable()
export class StatsService {
  constructor(
    @InjectRepository(CounterEntity)
    private counterRepo: Repository<CounterEntity>,
    @InjectRepository(ProcesadosEntity)
    private procesadosRepo: Repository<ProcesadosEntity>,
  ) {}

  async getCount() {
    const counter = await this.counterRepo.findOne({ where: { id: 1 } });
    return { total: counter?.total || 0 };
  }

  async increment(type: string = 'pdf', hash: string | null = null) {
    await this.procesadosRepo.insert({ tipo: type, hash });
    await this.counterRepo.increment({ id: 1 }, 'total', 1);
    const counter = await this.counterRepo.findOne({ where: { id: 1 } });
    return { total: counter!.total };
  }
}