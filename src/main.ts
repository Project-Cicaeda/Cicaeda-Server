import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ConfigService } from "@nestjs/config";
import { config } from "dotenv";

async function bootstrap(){
    const app = await NestFactory.create(AppModule);

    app.enableCors();

    const configService = app.get(ConfigService);
    const PORT = configService.get<number>('PORT') || 3000;

    await app.listen(PORT);

    console.log("the server is running on local host port :3000");
    
}

bootstrap();