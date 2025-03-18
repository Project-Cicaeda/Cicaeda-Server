import { Controller, Post, Body, Req, UseGuards } from "@nestjs/common";
import { QuestionnaireService } from "./ques.service";
import { Request } from "express";
import { AuthGuard } from "src/guards/auth.guard";

//questionnaire controller
@Controller('questionnaire')
export class QuestionnaireController{
    constructor(private readonly questionnaireService: QuestionnaireService){}

    //post request for submitting the answers
    //@UseGuards(AuthGuard)
    @Post("submit")
    async submitQues(
        @Body() body: { responses: {key: string, value: string}[]}): Promise<number>{

           const { responses} = body;
           return this.questionnaireService.calculation(/*userId,*/ responses);
        }
    //declare the controller to get the user result history
}

