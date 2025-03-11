import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import {Document, Types} from "mongoose";

//schema to gather information to save results
@Schema({timestamps: true})
export class SaveResult extends Document{
    @Prop({required: true})
    email: string; //to check the user account

    @Prop({type: Number, required:true})
    totalScore: number; //questionnaire score

    @Prop({ required: true})
    createdAt: Date; //date the result was saved
}

export const ResultSchema = SchemaFactory.createForClass(SaveResult);