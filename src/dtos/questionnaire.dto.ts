import { IsArray, IsNotEmpty, IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

class AnswerDto{
    @IsString()
    key: string;

    @IsString()
    value: string;
}

export class QuestionnaireDto{
    @IsArray()
    @IsNotEmpty()
    responses: {key: string, value: string}[];
}