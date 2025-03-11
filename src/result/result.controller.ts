import { Controller, Post, Body, Req , Get} from "@nestjs/common";
import { ResultService } from "./result.service";

@Controller('result')
export class resultController{
    constructor(private readonly resultService: ResultService){}

    //saving the scores according to user
    @Post('save')
    async saveResult(@Req() req, @Body() body){

        //checking if the user exists in the database
        if(!req.User || !req.User.userID){
            throw new Error("user ID not found in payload");
        }

        const userID = req.User.userID;
        const {totalScore} = body;
        return this.resultService.saveResult(userID, totalScore); //save result 
    }

    //getting the score history from the database 
    @Get('history')
    async getHistory(@Req() req){
        const userID = req.User.userID;
        return this.resultService.getUserScore(userID);
    }
}