import { Test, TestingModule } from '@nestjs/testing';
import { TsfService } from './tsf.service';

describe('TsfService', () => {
  let service: TsfService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TsfService],
    }).compile();

    service = module.get<TsfService>(TsfService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
