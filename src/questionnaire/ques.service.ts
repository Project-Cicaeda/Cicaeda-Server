import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { SaveResult } from "src/schemas/result.schema";
import * as fs from "fs";
import * as path from "path";
 
@Injectable()
export class QuestionnaireService implements OnModuleInit{

    //initializing marking system
    private markingSystem: Record<string, Record<string, number>> = {};

    //constraints and marks for the age and related marks
    private ageMarkingSystem = [
        {min: 50, max: 59, points:2},
        {min: 60, max: 69, points:3},
        {min: 70, max: 100, points:4}
    ];

    //string fields that are not considered for the marking system
    readonly nonScorableFields = ["fName", "lName", "city", "address" ];

    constructor(
        @InjectModel(SaveResult.name) private readonly resultModel:Model<SaveResult>
    ){}

    //loading questions function
    async onModuleInit(){
        this.loadQuestions();
    }

    //loading questions from the questionnaire json file
    private loadQuestions(){
        const filepath = path.join(process.cwd(), 'src', 'questionnaire', 'data', 'questions.json');
        const filecontent = fs.readFileSync(filepath, "utf-8");
        this.markingSystem = JSON.parse(filecontent);
    }

    //calculating the score for the questionnaire answers
    async calculation(userId: string, responses: {key: string; value: string}[]){
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

        //addding the points given for the age range to the total 
        if(userAge != null){
            for(const range of this.ageMarkingSystem){
                if( userAge >= range.min && userAge <= range.max){
                    agePoints = range.points;
                    total += agePoints;
                }
            }
        }

        //saving result in the DB
        const resultSave = await this.resultModel.create({userId, total});        
        await resultSave.save();
        //return the stored result
        return { message: 'Questionnaire successfully submitted', 
            resultSave};
    }
}

