import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ConfigService } from "@nestjs/config";
import { config } from "dotenv";
import { Connection } from "mongoose";

async function bootstrap(){
    const app = await NestFactory.create(AppModule);

    app.enableCors();

    const configService = app.get(ConfigService);
    const PORT = configService.get<number>('PORT') || 3000;

    const connection = app.get<Connection>(Connection);

    try{
        await connection.db.admin().ping();
        console.log("Dtabase connected!");
    }catch(err){
        console.error('connection failed ', err);
    }

    await app.listen(PORT);

    console.log("the server is running on local host port :3000");
    
}

bootstrap();