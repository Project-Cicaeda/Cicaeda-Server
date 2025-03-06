import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from '../auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { QuestionnaireController } from '../questionnaire/ques.controller';
import { QuestionnaireService } from '../questionnaire/ques.service';
import { QuestionnaireResult, QuesResultSchema } from '../schemas/ques.schema';
import { TsfController } from 'src/tsf/tsf.controller';
import { TsfService } from 'src/tsf/tsf.service';

//db connection string
let db = 'mongodb+srv://projectcicaeda:se37@cluster0.xoffd.mongodb.net/Data_Base?retryWrites=true&w=majority'  //To recover from write failures(drawbacks??)

@Module({
  imports: [
    MongooseModule.forRoot(db), //Change to async if dynamic
    MongooseModule.forFeature([{name: QuestionnaireResult.name, schema: QuesResultSchema}]),
    JwtModule.register({ global: true, secret: '123'}),
    AuthModule
  ], 
  controllers: [AppController, QuestionnaireController,TsfController],
  providers: [AppService,   QuestionnaireService,TsfService],
})
export class AppModule {}
