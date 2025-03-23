import { Test, TestingModule } from "@nestjs/testing";
import { QuestionnaireService } from "./ques.service";
import { getModelToken } from "@nestjs/mongoose";
import { SaveResult } from "../schemas/result.schema";
import { User } from "../schemas/user.schema";
import { Model, Types } from "mongoose";
import { JwtService } from "@nestjs/jwt";
import { BadRequestException } from "@nestjs/common";

describe("QuestionnaireService", () => {
    let service: QuestionnaireService;
    let resultModel: Model<SaveResult>;
    let userModel: Model<User>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                QuestionnaireService,
                {
                    provide: getModelToken(SaveResult.name),
                    useValue: {
                        create: jest.fn(),
                    },
                },
                {
                    provide: getModelToken(User.name),
                    useValue: {
                        findOne: jest.fn(),
                    },
                },
                {
                    provide: JwtService,
                    useValue: {
                        sign: jest.fn().mockReturnValue("mocked-token"),
                        verify: jest.fn().mockReturnValue({ userId: "mocked-user-id" }),
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
        const validUserId = "67dbba701e18c22c410901dc"; // Existing user ID

        jest.spyOn(userModel, "findOne").mockReturnValueOnce({
            exec: jest.fn().mockResolvedValue({
                _id: new Types.ObjectId(validUserId),
            }),
        } as any);

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

        const result = await service.calculation(validUserId, responses);
        console.log("Debug Total:", result.total, "Percentage:", result.percentage);
        expect(result.percentage).toBeCloseTo((result.total / 11) * 100);
    });
    it("should throw an error if user ID format is invalid", async () => {
        await expect(service.calculation("invalid ID", [])).rejects.toThrow(BadRequestException);
        await expect(service.calculation("invalid ID", [])).rejects.toThrow("Invalid user ID format");
    });

    it("should throw an error if user is not found", async () => {
        const validUserId = new Types.ObjectId().toHexString(); // Generate a valid ObjectId

        jest.spyOn(userModel, "findOne").mockReturnValueOnce({
            exec: jest.fn().mockResolvedValue(null),
        } as any);

        await expect(service.calculation(validUserId, [])).rejects.toThrow("User not found");
    });

    it("should save result in database", async () => {
        const validUserId = "67dbba701e18c22c410901dc"; // Use a real ObjectId

        const mockSave = jest.fn().mockResolvedValue({
            _id: "test123",
            userId: new Types.ObjectId(validUserId),
            total: 10,
        });

        jest.spyOn(resultModel, "create").mockResolvedValueOnce({
            _id: "test123",
            userId: new Types.ObjectId(validUserId),
            total: 10,
            save: mockSave, // Ensure save is properly mocked
        } as any);

        const result = await service.saveQuesResult(validUserId, 10);
        expect(result).toBeDefined();
        expect(result.total).toBe(10);
    });
});