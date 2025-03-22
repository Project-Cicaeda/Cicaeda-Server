// import { Controller, Post, Body, Req , Get, Param} from "@nestjs/common";
// import { ResultService } from "./result.service";

// @Controller('result')
// export class resultController{
//     constructor(private readonly resultService: ResultService){}

//     //saving the scores according to user
//     @Post()
//     async saveResult(@Body() body: {userId: string, totalScore:number}){
//             return this.resultService.saveResult(body.userId, body.totalScore);
//     }

//     // //getting the score history from the database 
//     // @Get('userId')
//     // async getHistory(@Param('userId') userId:string){
//     //     return this.resultService.getUserScore(userId);
//     // }
// }