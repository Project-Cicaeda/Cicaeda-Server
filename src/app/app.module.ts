import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from '../auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { QuestionnaireController } from '../questionnaire/ques.controller';
import { QuestionnaireService } from '../questionnaire/ques.service';
import { QuestionnaireResult, QuesResultSchema } from '../schemas/ques.schema';
import { ResultModule } from 'src/result/result.module';

//db connection string
let db = 'mongodb+srv://projectcicaeda:se37@cluster0.xoffd.mongodb.net/Data_Base?retryWrites=true&w=majority'  //To recover from write failures(drawbacks??)

@Module({
  imports: [
    MongooseModule.forRoot(db), //Change to async if dynamic
    MongooseModule.forFeature([{name: QuestionnaireResult.name, schema: QuesResultSchema}]),
    JwtModule.register({ global: true, secret: '123'}),
    AuthModule,
    ResultModule
  ], 
  controllers: [AppController, QuestionnaireController],
  providers: [AppService,   QuestionnaireService],
})
export class AppModule {}
