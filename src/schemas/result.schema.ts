import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import {Document, Types} from "mongoose";

@Schema({timestamps: true})
export class SaveResult extends Document{
    @Prop({type: Types.ObjectId, ref: 'User', required: true})
    userID: Types.ObjectId;

    @Prop({type: Number, required:true})
    totalScore: number;

    @Prop({type: String, required:true})
    riskScore: string;
}

export const ResultSchema = SchemaFactory.createForClass(SaveResult);