import { IsArray, IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

class AnswerDto{
    @IsString()
    key: string;

    @IsString()
    value: string;
}

export class QuestionnaireDto{
    @IsArray()
    @ValidateNested({each: true})
    @Type(() => AnswerDto)
    responses: AnswerDto[];
}