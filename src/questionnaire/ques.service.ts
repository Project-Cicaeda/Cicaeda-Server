import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { QuestionnaireResult } from "src/auth/schemas/ques.schema";

@Injectable()
export class QuestionnaireService{
    constructor(@InjectModel(QuestionnaireResult.name) private readonly resultModel:Model<QuestionnaireResult>){}

    private markingSystem = {
        ques1: {/*marks for the options */},
        ques2: {Yes: 2, No: 0},
        //marks for other questions
    };

    async calculation(responses: {key: string; value: string}[]){
        let total = 0;

        responses.forEach(({key, value}) => {
            if(this.markingSystem[key] && this.markingSystem[key][value] !== undefined){
                total += this.markingSystem[key][value];
            }
        });

        const result = new this.resultModel({
            responses,
            total,
            createdAt: new Date(),

        })
        
        const savedScore = await result.save();

        //return the stored result
        return { message: 'Questionnaire successfully submitted', total, savedScore};
    }
}

