import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import {Document, Types} from "mongoose";

//schema to gather information to save results
@Schema({timestamps: true})
export class SaveResult extends Document{
    @Prop({required: true, type: Types.ObjectId, ref: 'User', index: true})
    userId: Types.ObjectId; //to check the user account

    @Prop({type: Number, required:true})
    totalScore: number; //questionnaire score

    @Prop({ required: true, default: Date.now})
    createdAt: Date; //date the result was saved
}

export const SaveResultSchema = SchemaFactory.createForClass(SaveResult);

