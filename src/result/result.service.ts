import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { SaveResult } from "src/schemas/result.schema";


@Injectable()
export class ResultService{
    constructor(@InjectModel(SaveResult.name) private resultModel: Model<SaveResult>){}

    async saveResult(userID: string, totalScore: number, riskScore: string){
        const result = new this.resultModel({userID, totalScore, riskScore});
        return result.save();
    }

    async getUserScore(userID: string){
        return this.resultModel.find({userID}).sort({createdAt: -1}).exec();
    }
}