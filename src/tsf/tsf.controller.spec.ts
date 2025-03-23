import { Test, TestingModule } from '@nestjs/testing';
import { TsfController } from './tsf.controller';
import { TsfService } from './tsf.service';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';

describe('TsfController', () => {
  let app: INestApplication;
  let tsfService: TsfService;

  const mockTsfService = {
    predict: jest.fn().mockResolvedValue([168,147,124,111,107,110,117,124,131,138,145,153]),
  };

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [TsfController],
      providers: [{ provide: TsfService, useValue: mockTsfService }],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
    tsfService = moduleRef.get<TsfService>(TsfService);
  });

  afterAll(async () => {
    await app.close();
  });

  it('should return forecasted values for a city', async () => {
    return request(app.getHttpServer())
      .get('/forecast?city=Colombo')
      .expect(200)
      .expect((res) => {
        expect(res.body).toEqual([    168,
          147,
          124,
          111,
          107,
          110,
          117,
          124,
          131,
          138,
          145,
          153]);
      });
  });
});
