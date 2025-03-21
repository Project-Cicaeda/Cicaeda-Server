import { Controller, Post, Body, Get, Req, UseGuards, Param } from "@nestjs/common";
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
        @Body() body: { userId: string, responses: {key: string, value: string}[]}): Promise<{percentage: number}>{
           const {userId, responses} = body;
           return this.questionnaireService.calculation(userId, responses);
        }
    //declare the controller to get the user result history
    @Get("history/:userId")
    async getHistory(@Param("userId") userId: string): Promise<any>{
        return this.questionnaireService.getQuesResult(userId)
    }
}

