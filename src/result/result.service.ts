// import { Injectable } from "@nestjs/common";
// import { InjectModel } from "@nestjs/mongoose";
// import { Model } from "mongoose";
// import { SaveResult } from "src/schemas/result.schema";


// @Injectable()
// export class ResultService{
  
//     constructor(@InjectModel(SaveResult.name) 
//         private readonly resultModel: Model<SaveResult>
//     ){}

//     //saving result with the userID
//     async saveResult(userId: string, totalScore: number){
//         const result = new this.resultModel({userId, totalScore});
//         await result.save();

//         return {userId, message: "result saved succesfully"};
//     }

// }