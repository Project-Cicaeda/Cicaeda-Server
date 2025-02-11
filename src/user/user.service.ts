//interacts with the database
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import * as bcrypt from 'bcryptjs';
import {User, UserDocument} from './user.schema';

@Injectable()
export class UserService{
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

    //retrieves a user by their username
    async findUser(email : string): Promise<User | null>{
        return this.userModel.findOne({ email }).exec();
    }

}