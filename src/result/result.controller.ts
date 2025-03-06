import { Controller, Post, Body, Req , Get} from "@nestjs/common";
import { ResultService } from "./result.service";

@Controller('result')
export class resultController{
    constructor(private readonly resultService: ResultService){}

    @Post('save')
    async saveResult(@Req() req, @Body() body){

        if(!req.User || !req.User.userID){
            throw new Error("user ID not found in payload");
        }

        const userID = req.User.userID;
        const {totalScore} = body;
        return this.resultService.saveResult(userID, totalScore);
    }

    @Get('history')
    async getHistory(@Req() req){
        const userID = req.User.userID;
        return this.resultService.getUserScore(userID);
    }
}