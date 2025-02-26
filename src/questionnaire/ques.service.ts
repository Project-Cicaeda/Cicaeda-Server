import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { QuestionnaireResult } from "src/schemas/ques.schema";
import * as fs from "fs";
import * as path from "path";
 
@Injectable()
export class QuestionnaireService implements OnModuleInit{

    private markingSystem: Record<string, Record<string, number>> = {};

    private ageMarkingSystem = [
        {min: 50, max: 59, points:2},
        {min: 60, max: 69, points:3},
        {min: 70, max: 100, points:4}
    ];

    readonly nonScorableFields = ["fName", "lName", "city", "address" ];

    constructor(@InjectModel(QuestionnaireResult.name) private readonly resultModel:Model<QuestionnaireResult>){}

    async onModuleInit(){
        this.loadQuestions();
    }

    private loadQuestions(){
        const filepath = path.join(__dirname, 'data', 'questions.json');
        const filecontent = fs.readFileSync(filepath, "utf-8");
        this.markingSystem = JSON.parse(filecontent);
    }

    async calculation(responses: {key: string; value: string}[]){
        let total = 0;
        let userDetails: Record<string, string> = {};
        let userAge: number | null = null;
        let agePoints = 0;

        responses.forEach(({key, value}) => {
            
            //store string values seperately
            if(this.nonScorableFields.includes(key)){
                userDetails[key] = value;
            }

            //convert age from string to number
            else if(key === "age"){
                userAge = parseInt(value);
            }

            //else process it for scoring
            else if(this.markingSystem[key] && this.markingSystem[key][value] !== undefined){
                total += this.markingSystem[key][value];
            }
        });

        if(userAge != null){
            for(const range of this.ageMarkingSystem){
                if( userAge >= range.min && userAge <= range.max){
                    agePoints = range.points;
                    total += agePoints;
                }
            }
        }

        await new this.resultModel({total}).save;
        
        
        //return the stored result
        return { message: 'Questionnaire successfully submitted', 
            total};
    }
}

