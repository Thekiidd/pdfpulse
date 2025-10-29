import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatsController } from './stats.controller';
import { StatsService } from './stats.service';
import { CounterEntity } from './entities/counter.entity';
import { ProcesadosEntity } from './entities/procesados.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CounterEntity, ProcesadosEntity])],
  controllers: [StatsController],
  providers: [StatsService],
})
export class StatsModule {}