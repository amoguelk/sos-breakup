import { Module } from '@nestjs/common';
import { AdviceGateway } from './advice.gateway';
import { AdviceService } from './advice.service';

@Module({ providers: [AdviceGateway, AdviceService] })
export class AdviceModule {}
