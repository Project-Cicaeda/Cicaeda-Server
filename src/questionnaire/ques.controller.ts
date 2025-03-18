import { Controller, Post, Body, Req } from "@nestjs/common";
import { QuestionnaireService } from "./ques.service";
import { Request } from "express";

@Controller('questionnaire')
export class QuestionnaireController{
    constructor(private readonly questionnaireService: QuestionnaireService){}

    //post request for submitting the answers
    // @UseGuards(AuthGuard)

    @Post("submit")
    async submitQues(
        @Req() req: Request & { user?: {userId:string} }, //define user property,
        @Body() {responses}: {responses: {key: string; value: string}[]}){
            const userId = req.user.userId;
            return this.questionnaireService.calculation(userId, responses);
    }
}
