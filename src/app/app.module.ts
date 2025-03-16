import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from '../auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
<<<<<<< Updated upstream
import { QuestionnaireController } from '../questionnaire/ques.controller';
import { QuestionnaireService } from '../questionnaire/ques.service';
import { QuestionnaireResult, QuesResultSchema } from '../schemas/ques.schema';
=======
import { ConfigModule, ConfigService } from '@nestjs/config';
import config from '../config/config';

import { ResultModule } from 'src/result/result.module';
import { TsfController } from 'src/tsf/tsf.controller';
import { TsfService } from 'src/tsf/tsf.service';
>>>>>>> Stashed changes

//db connection string
let db = 'mongodb+srv://projectcicaeda:se37@cluster0.xoffd.mongodb.net/Data_Base?retryWrites=true&w=majority'  //To recover from write failures(drawbacks??)

@Module({
  imports: [
<<<<<<< Updated upstream
    MongooseModule.forRoot(db), //Change to async if dynamic
    MongooseModule.forFeature([{name: QuestionnaireResult.name, schema: QuesResultSchema}]),
    JwtModule.register({ global: true, secret: '123'}),
    AuthModule
  ], 
  controllers: [AppController, QuestionnaireController],
  providers: [AppService,   QuestionnaireService],
=======
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,  
      load: [config]
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config) => ({
        uri: config.get('database.connectionString'),
      }),
      inject: [ConfigService],
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (config) => ({
        secret: config.get('jwt.secret'),
      }),
      global: true,
      inject: [ConfigService]
    }),
    AuthModule,
    ResultModule // Keeping ResultModule from ResultSaving branch
  ],
  controllers: [AppController, TsfController],
  providers: [AppService,  TsfService],
>>>>>>> Stashed changes
})
export class AppModule {}
