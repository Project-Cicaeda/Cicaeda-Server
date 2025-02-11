import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "src/user/user.service";
import * as bcrypt from 'bcryptjs';

@Injectable()
export class authenticationS{
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
    ){}

    //validating credentials
    async validate(email:string, password:string): Promise<any> {
        const user = await this.userService.findUser(email);

        if(!user){
            throw new UnauthorizedException("Invalid credentials!");
        }
        
        const correctPassword = await bcrypt.compare(password, user.password)
        
        if(!correctPassword){
            throw new UnauthorizedException("Invalid credentials!");
        }

        return {email: user.email};
    }

    async login(email: string, password: string){
        const user = await this.validate(email, password);

        const payload = { email: user.email, sub: user._id };

        return{
            token: this.jwtService.sign(payload),  //generate a token
        };
    }
}