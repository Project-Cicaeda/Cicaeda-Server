import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://projectCicaeda:PC2025@projectcicaeda.quwjx.mongodb.net/?retryWrites=true&w=majority&appName=ProjectCicaeda') //connection string from mongoDB atlas
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
