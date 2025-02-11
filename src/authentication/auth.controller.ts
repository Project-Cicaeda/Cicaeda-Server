import { Controller, Post, Body } from "@nestjs/common";
import { authenticationS } from "./auth.service";


@Controller('auth')
export class authenticationC{
    constructor(private authService: authenticationS){}

    @Post('login')  //POST endpoint
    async login(@Body() body: {email:string; password:string}){
        return this.authService.login(body.email, body.password);  //calling the function in auth.service file
    }
}
