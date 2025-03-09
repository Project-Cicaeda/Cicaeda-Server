import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import {Document, Types} from "mongoose";

@Schema({timestamps: true})
export class SaveResult extends Document{
    @Prop({required: true})
    email: string;

    @Prop({type: Number, required:true})
    totalScore: number;

    @Prop({ required: true})
    createdAt: Date;
}

export const ResultSchema = SchemaFactory.createForClass(SaveResult);