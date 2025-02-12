import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';

//db connection string
let db = 'mongodb+srv://projectcicaeda:se37@cluster0.xoffd.mongodb.net/Data_Base?retryWrites=true&w=majority'  //To recover from write failures(drawbacks??)

@Module({
  imports: [
    MongooseModule.forRoot(db), //Change to async if dynamic
    JwtModule.register({ global: true, secret: '123'}),
    AuthModule
  ], 
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
