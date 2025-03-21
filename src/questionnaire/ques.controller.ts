import { Controller, Post, Body, Get, Req, UseGuards, Param } from "@nestjs/common";
import { QuestionnaireService } from "./ques.service";
import { Request } from "express";
import { AuthGuard } from "src/guards/auth.guard";

//questionnaire controller
@Controller('questionnaire')
export class QuestionnaireController{
    constructor(private readonly questionnaireService: QuestionnaireService){}

    //post request for submitting the answers
    @UseGuards(AuthGuard)
    @Post("submit")
    async submitQues(
        @Req () req,
        @Body() body: Record<string, any>): Promise<{percentage: number}>{

            //extracting userId from the request
            const userId = req.user["userId"];

           const responses = Object.entries(body).map(([key, value]) => ({key, value: String(value)}));
           
           return this.questionnaireService.calculation(userId, responses);
        }
    //declare the controller to get the user result history
    @UseGuards(AuthGuard)
    @Get("history")
    async getHistory(@Req() req): Promise<any>{
        const userId = req.user["userId"];
        return this.questionnaireService.getQuesResult(userId);
    }
}

