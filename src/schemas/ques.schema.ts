import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";


export type QuestionnaireResultDoc = QuestionnaireResult & Document;

@Schema()
export class QuestionnaireResult{

    //declaring the user responses array
    @Prop({ type: [{ key: String, value: String }], default: [] })
    responses: { key: string; value: string }[]; 

    @Prop({required: true})
    total: number;

    @Prop({default: Date.now})
    createdAt: Date;
}

export const QuesResultSchema = SchemaFactory.createForClass(QuestionnaireResult);