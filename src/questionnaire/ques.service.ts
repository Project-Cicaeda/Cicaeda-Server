import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { QuestionnaireResult } from "src/auth/schemas/ques.schema";

@Injectable()
export class QuestionnaireService{
    constructor(@InjectModel(QuestionnaireResult.name) private readonly resultModel:Model<QuestionnaireResult>){}

    private markingSystem = {
        //medical conditions
        question1: {Male: 0, Female: 1}, //gender
        question2: {Yes: 1, No: 0}, //anemia
        question3: {Yes: 1, No: 0}, //high blood pressure
        question4: {Yes: 1, No: 0}, //diabetes
        question5: {Yes: 0, No: 0}, //Cardio vascular disease

        //medical history
        question6: {Yes: 1, No: 0}, //heartattacks
        question7: {Yes: 1, No: 0}, //congestive heart failure
        question8: {Yes: 0, No: 0}, //fam. history of heart disease

        //kidney health questions
        question9: {Yes: 1, No: 0}, // protienuria 
        question10: {Yes: 0, No: 0}, //foamy or bubbly urine
        question11: {Yes: 0, No: 0}, //frequant urine passing
        question12: {Yes: 0, No: 0}, //less urine passing
        question13: {Yes: 0, No: 0}, //

        //general health
        question14: {Yes: 1, No: 0}, //ankle edema
        question15: {Yes: 0, No: 0}, //low energy
        question16: {Yes: 0, No: 0}, //brain fog
        question17: {Yes: 0, No: 0}, //unexplained weight loss
        question18: {Yes: 0, No: 0},
        question19: {Yes: 0, No: 0},
    };

    private ageMarkingSystem = [
        {min: 50, max: 59, points:2},
        {min: 60, max: 69, points:3},
        {min: 70, max: 100, points:4}
    ];

    readonly nonScorableFields = ["fName", "lName", "city", "address" ];

    async calculation(responses: {key: string; value: string}[]){
        let total = 0;
        let userDetails: Record<string, string> = {};
        let userAge: number | null = null;
        let agePoints = 0;

        responses.forEach(({key, value}) => {
            
            //store string values seperately
            if(["fName", "lName", "city", "address" ].includes(key)){
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

        const result = new this.resultModel({
            responses,
            total,
        })
        
        const savedScore = await result.save();

        //return the stored result
        return { message: 'Questionnaire successfully submitted', result};
    }
}

