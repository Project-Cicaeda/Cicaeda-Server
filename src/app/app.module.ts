import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from '../auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import config from '../config/config';

import { QuestionnaireController } from '../questionnaire/ques.controller';
import { QuestionnaireService } from '../questionnaire/ques.service';
import { QuestionnaireResult, QuesResultSchema } from '../schemas/ques.schema';
import { ResultModule } from 'src/result/result.module';
import { TsfController } from 'src/tsf/tsf.controller';
import { TsfService } from 'src/tsf/tsf.service';

// Setting values dynamically to securely pass confidential info & to change values easily
@Module({
  imports: [
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
    MongooseModule.forFeature([{ name: QuestionnaireResult.name, schema: QuesResultSchema }]),
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
  controllers: [AppController, QuestionnaireController, TsfController],
  providers: [AppService, QuestionnaireService, TsfService],
})
export class AppModule {}

