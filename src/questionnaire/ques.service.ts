import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { QuestionnaireResult } from "src/schemas/ques.schema";
import * as fs from "fs";
import * as path from "path";
 
@Injectable()
export class QuestionnaireService implements OnModuleInit{ //extracting the questions logic

    private markingSystem: Record<string, Record<string, number>> = {}; //getting the key and values from the questions.json file

    //to give points based on the age range
    private ageMarkingSystem = [
        {min: 50, max: 59, points:2},
        {min: 60, max: 69, points:3},
        {min: 70, max: 100, points:4}
    ];

    //user details
    readonly nonScorableFields = ["fName", "lName", "city", "address" ];

    constructor(@InjectModel(QuestionnaireResult.name) private readonly resultModel:Model<QuestionnaireResult>){}

    //loading the questions
    async onModuleInit(){
        this.loadQuestions();
    }

    private loadQuestions(){
        const filepath = path.join(process.cwd(), 'src', 'questionnaire', 'data', 'questions.json');
        const filecontent = fs.readFileSync(filepath, "utf-8");
        this.markingSystem = JSON.parse(filecontent);
    }

    //calculation of the points based on the inputs
    async calculation(responses: {key: string; value: string}[]){
        let total = 0;  //final points
        let userDetails: Record<string, string> = {};  //storing the uer details
        let userAge: number | null = null;  //age of the user
        let agePoints = 0;  //points given for the age range

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

        //calculating the age points and adding them to the total
        if(userAge != null){
            for(const range of this.ageMarkingSystem){
                if( userAge >= range.min && userAge <= range.max){
                    agePoints = range.points;
                    total += agePoints;
                }
            }
        }

        //saving the result
        await new this.resultModel({total}).save;
        
        //return the stored result
        return { message: 'Questionnaire successfully submitted', 
            total};
    }
}

