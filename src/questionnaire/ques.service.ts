import {  Injectable, OnModuleInit, BadRequestException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import * as fs from "fs";
import * as path from "path";
import { Types } from "mongoose";
import { SaveResult } from "../schemas/result.schema";
import { User } from "../schemas/user.schema";

@Injectable()
export class QuestionnaireService implements OnModuleInit{ //extracting the questions logic

    //initializing marking system
    private markingSystem: Record<string, Record<string, number>> = {};

    //constraints and marks for the age and related marks
    private ageMarkingSystem = [
        {min: 50, max: 59, points:2},
        {min: 60, max: 69, points:3},
        {min: 70, max: 100, points:4}
    ];

    //user details
    readonly nonScorableFields = ["fName", "lName", "city", "address" ];

    constructor(
        @InjectModel(SaveResult.name) private readonly resultModel: Model<SaveResult>,
        @InjectModel(User.name) private readonly userModel: Model<User>,
    ) {}

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

    //calculation of the points based on the inputs
    async calculation(userId:string, responses: {key: string; value: string}[]){
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

        //addding the points given for the age range to the total 
        if(userAge != null){
            for(const range of this.ageMarkingSystem){
                if( userAge >= range.min && userAge <= range.max){
                    agePoints = range.points;
                    total += agePoints;
                    break;
                }
            }
        }

        if (!Types.ObjectId.isValid(userId)) {
            throw new BadRequestException("Invalid user ID format");
        }

        const existUser = await this.userModel.findOne({ _id: new Types.ObjectId(userId) }).exec();
        const percentage = (total/11) * 100;
        if(existUser){
            await this.saveQuesResult(userId, percentage);
            return {percentage};

        }
        else{
            throw new Error("User not found");
        } 
    }

    //saving result in the DB
    async saveQuesResult(userId: string, percentage: number){

        if (!Types.ObjectId.isValid(userId)) {
            throw new BadRequestException("Invalid user ID format");
        }

        return await this.resultModel.create({
            userId: new Types.ObjectId(userId),
            percentage,
        });
    }

    async getQuesResult(userId: string){
        const results = await this.resultModel.find({userId: new Types.ObjectId(userId)}).sort({createdAt: -1}).exec();
        if(!results || results.length === 0){
            throw new Error("No results found");
        }
        return results;
    }
}

