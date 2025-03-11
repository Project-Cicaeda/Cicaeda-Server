import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";


export type QuestionnaireResultDoc = QuestionnaireResult & Document;

@Schema()
export class QuestionnaireResult{
    //declaring the user responses array
    @Prop({type: Array})
    responses: {key: string; value: string}[];

    //total result of the questionnaire
    @Prop({required: true})
    total: number;

    //the date the result was calculated
    @Prop({default: Date.now})
    createdAt: Date;
}

export const QuesResultSchema = SchemaFactory.createForClass(QuestionnaireResult);