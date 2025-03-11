import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { SaveResult } from "src/schemas/result.schema";


@Injectable()
export class ResultService{
    constructor(@InjectModel(SaveResult.name) private resultModel: Model<SaveResult>){}

    //saving result with the userID
    async saveResult(userID: string, totalScore: number){
        const result = new this.resultModel({userID, totalScore});
        return result.save();
    }

    //getting user result history for the visual representation
    async getUserScore(userID: string){
        return this.resultModel.find({userID}).sort({createdAt: -1}).exec();
    }

    //combine the result with the ml answer and return that to the user
}