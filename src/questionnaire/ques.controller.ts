import { Controller, Post, Body } from "@nestjs/common";
import { QuestionnaireService } from "./ques.service";
import { QuestionnaireDto } from "src/dtos/questionnaire.dto";

@Controller('questionnaire')
export class QuestionnaireController{
    constructor(private readonly questionnaireService: QuestionnaireService){}

    @Post()
    async submitQues(@Body() questionnaireDto : QuestionnaireDto){
        return this.questionnaireService.calculation(questionnaireDto.responses);
    }
}