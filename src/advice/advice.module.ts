import { Module } from '@nestjs/common';
import { AdviceGateway } from './advice.gateway';
import { AdviceService } from './advice.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Advice } from './advice.entity';

@Module({
  providers: [AdviceGateway, AdviceService],
  imports: [TypeOrmModule.forFeature([Advice])],
})
export class AdviceModule {}
