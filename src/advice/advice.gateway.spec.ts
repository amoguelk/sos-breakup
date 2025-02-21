import { Test, TestingModule } from '@nestjs/testing';
import { AdviceGateway } from './advice.gateway';

describe('AdviceGateway', () => {
  let gateway: AdviceGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdviceGateway],
    }).compile();

    gateway = module.get<AdviceGateway>(AdviceGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
