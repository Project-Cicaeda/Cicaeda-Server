import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { QuestionnaireResult } from "src/auth/schemas/ques.schema";

@Injectable()
export class QuestionnaireService{
    constructor(@InjectModel(QuestionnaireResult.name) private readonly resultModel:Model<QuestionnaireResult>){}

    private markingSystem = {
        question1: {A: 5, B: 3, C: 1},
        question2: {Yes: 2, No: 0},
        //marks for other questions
    };

    readonly nonScorableFields = ["fName", "lName", "city", "address" ];

    async calculation(responses: {key: string; value: string}[]){
        let total = 0;
        let userDetails: Record<string, string> = {};

        responses.forEach(({key, value}) => {
            if(["fName", "lName", "city", "address" ].includes(key)){
                userDetails[key] = value;
            }

            //else process it for scoring
            else if(this.markingSystem[key] && this.markingSystem[key][value] !== undefined){
                total += this.markingSystem[key][value];
            }
        });

        const result = new this.resultModel({
            responses,
            total,
        })
        
        const savedScore = await result.save();

        //return the stored result
        return { message: 'Questionnaire successfully submitted', total, savedScore};
    }
}

