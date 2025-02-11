import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './authentication/auth.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}),
    MongooseModule.forRoot('mongodb+srv://projectCicaeda:PC2025@projectcicaeda.quwjx.mongodb.net/?retryWrites=true&w=majority&appName=ProjectCicaeda'), //connection string from mongoDB atlas
    AuthModule,
    UserModule,
  ],
})
export class AppModule {}
