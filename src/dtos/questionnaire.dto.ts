import { IsArray, IsNotEmpty, IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

//data transfer object for the key value pairs in the questions
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