import { IsArray, IsNotEmpty, IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

//data transfer object for the key value pairs in the questions
class AnswerDto{
    //key of the responses array recieved from the frontend
    @IsString()
    key: string;

    //the value of the related key
    @IsString()
    value: string;
}

//declaring the responses array with the key value pairs
export class QuestionnaireDto{
    @IsArray()
    @IsNotEmpty()
    responses: {key: string, value: string}[];
}