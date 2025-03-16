import { Controller, Post, Body, Req } from "@nestjs/common";
import { QuestionnaireService } from "./ques.service";
import { Request } from "express";

//questionnaire controller
@Controller('questionnaire')
export class QuestionnaireController{
    constructor(private readonly questionnaireService: QuestionnaireService){}

    //POST endpoint to get the responses
    @Post()
    async submitQues(@Body() questionnaireDto : QuestionnaireDto){
        return this.questionnaireService.calculation(questionnaireDto.responses);
    }

    //post request for submitting the answers
    @Post("submit")
    async submitQues(
        @Req() req: Request,
        @Body() {responses}: {responses: {key: string; value: string}[]}){
           const userId = req.body.User['userId'];
           return this.questionnaireService.calculation(userId, responses);
        }
    //declare the controller to get the user result history
}