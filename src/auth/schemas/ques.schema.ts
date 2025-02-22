import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";


export type QuestionnaireResultDoc = QuestionnaireResult & Document;

@Schema()
export class QuestionnaireResult{
    @Prop({type: Array})
    responses: {key: string; value: string}[];

    @Prop({required: true})
    total: number;

    @Prop({default: Date.now})
    createdAt: Date;
}

export const QuesResultSchema = SchemaFactory.createForClass(QuestionnaireResult);