import { Test, TestingModule } from '@nestjs/testing';
import { QuestionnaireController } from './ques.controller';
import { QuestionnaireService } from './ques.service';

describe('QuestionnaireController', () => {
    let controller: QuestionnaireController;
    let service: QuestionnaireService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
          controllers: [QuestionnaireController],
          providers: [
            {
              provide: QuestionnaireService,
              useValue: {
                calculation: jest.fn().mockResolvedValue({ percentage: 85 }),
                getQuesResult: jest.fn().mockResolvedValue([{ userId: '123', total: 10 }]),
              },
            },
          ],
        }).compile();

        controller = module.get<QuestionnaireController>(QuestionnaireController);
        service = module.get<QuestionnaireService>(QuestionnaireService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('should submit questionnaire and return score', async () => {
        const req = { user: { userId: '123' } };
        const body = { q1: 'A', q2: 'B' };
    
        const result = await controller.submitQues(req, body);
        expect(result.percentage).toBe(85);
    });

    it('should get user questionnaire history', async () => {
        const req = { user: { userId: '123' } };
        const result = await controller.getHistory(req);
        expect(result.length).toBe(1);
    });
});
