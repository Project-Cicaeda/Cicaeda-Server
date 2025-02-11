import { from } from "rxjs";
import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Document} from 'mongoose';
import { Types } from "mongoose";

export type UserDocument = User & Document;

@Schema() //mongoose schema class
export class User{
    @Prop({type: Types.ObjectId})
    _id: Types.ObjectId;

    @Prop({ required: true, unique: true}) //ensures unique username
    email :string;

    @Prop({ required: true})
    password :string;
}

//generates mongoose schema based on the user class
export const UserSchema = SchemaFactory.createForClass(User);