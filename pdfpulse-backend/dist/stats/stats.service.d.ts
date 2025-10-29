import { Repository } from 'typeorm';
import { CounterEntity } from './entities/counter.entity';
import { ProcesadosEntity } from './entities/procesados.entity';
export declare class StatsService {
    private counterRepo;
    private procesadosRepo;
    constructor(counterRepo: Repository<CounterEntity>, procesadosRepo: Repository<ProcesadosEntity>);
    getCount(): Promise<{
        total: number;
    }>;
    increment(type?: string, hash?: string | null): Promise<{
        total: number;
    }>;
}
