import { Test, TestingModule } from "@nestjs/testing";
import { QuestionnaireService } from "./ques.service";
import { getModelToken } from "@nestjs/mongoose";
import { SaveResult } from "../schemas/result.schema";
import { User } from "../schemas/user.schema";
import { Model } from "mongoose";
import { Document } from "mongoose";
import { JwtService } from "@nestjs/jwt";
import { Types } from "mongoose";

describe("QuestionnaireService", () => {
    let service: QuestionnaireService;
    let resultModel: Model<SaveResult>;
    let userModel: Model<User>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                QuestionnaireService,
                { provide: getModelToken(SaveResult.name), useValue: { create: jest.fn() } },
                { provide: getModelToken(User.name), useValue: { findOne: jest.fn() } },
                {
                    provide: JwtService,
                    useValue: {
                        sign: jest.fn().mockReturnValue('mocked-token'),
                        verify: jest.fn().mockReturnValue({ userId: 'mocked-user-id' }),
                    },
                },
            ],
        }).compile();

        service = module.get<QuestionnaireService>(QuestionnaireService);
        resultModel = module.get<Model<SaveResult>>(getModelToken(SaveResult.name));
        userModel = module.get<Model<User>>(getModelToken(User.name));
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });

    it("should calculate score correctly", async () => {
        jest.spyOn(userModel, "findOne").mockResolvedValue({
            _id: '123',
            exec: jest.fn().mockResolvedValueOnce({ _id: '123' }), // Mock exec
        });

        const responses = [
            { key: "age", value: "55" },
            { key: "gender", value: "Male" },
            { key: "anemia", value: "Yes" },
            { key: "hbp", value: "No" },
            { key: "diabetes", value: "Yes" },
            { key: "cvd", value: "No" },
            { key: "heartattacks", value: "Yes" },
            { key: "chf", value: "No" },
        ];

        service["markingSystem"] = {
            gender: { "Male": 0, "Female": 1 },
            anemia: { "Yes": 1, "No": 0 },
            hbp: { "Yes": 1, "No": 0 },
            diabetes: { "Yes": 1, "No": 0 },
            cvd: { "Yes": 0, "No": 0 },
            heartattacks: { "Yes": 1, "No": 0 },
            chf: { "Yes": 0, "No": 0 },
        };

        const result = await service.calculation('123', responses);
        expect(result.percentage).toBeCloseTo((4 / 7) * 100);
    });

    it("should throw an error if user is not found", async () => {
        jest.spyOn(userModel, "findOne").mockResolvedValueOnce(null);

        await expect(service.calculation('invalid ID', [])).rejects.toThrow("User not found");
    });

    it("should save result in database", async () => {
        jest.spyOn(resultModel, 'create').mockResolvedValueOnce({
            _id: 'test123',
            __v: 0,
            save: jest.fn().mockResolvedValueOnce({
                _id: 'test123',
                total: 10,
                __v: 0,
            }),
        }as any);

        const result = await service.saveQuesResult('123', 10);
        expect(result).toBeDefined();
    });
});