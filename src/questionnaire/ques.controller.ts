import { Controller, Post, Body, Req } from "@nestjs/common";
import { QuestionnaireService } from "./ques.service";
import { QuestionnaireDto } from "src/dtos/questionnaire.dto";
import { Request } from "express";

//questionnaire controller
@Controller('questionnaire')
export class QuestionnaireController{
    constructor(private readonly questionnaireService: QuestionnaireService){}

    //post request for submitting the answers
    @Post("submit")
    async submitQues(
        @Req() req: Request,
        @Body() {responses}: {responses: {key: string; value: string}[]}){
           // const email = req.user['email'];
        }
    }

    //declare the controller to get the user result history
}