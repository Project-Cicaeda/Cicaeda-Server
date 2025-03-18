import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from '../auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import config from '../config/config';

import { QuestionnaireResult, QuesResultSchema } from '../schemas/ques.schema';
//import { ResultModule } from 'src/result/result.module';
import { TsfController } from 'src/tsf/tsf.controller';
import { TsfService } from 'src/tsf/tsf.service';
import { QuestionnaireModule } from 'src/questionnaire/questionnaire.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [config],
    }),

    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('database.connectionString'),
      }),
      inject: [ConfigService],
    }),

    MongooseModule.forFeature([{ name: QuestionnaireResult.name, schema: QuesResultSchema }]),

    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.secret'),
      }),
      global: true,
      inject: [ConfigService],
    }),

    AuthModule,
    QuestionnaireModule
    //ResultModule, // Keeping ResultModule from ResultSaving branch
  ],

  controllers: [AppController, TsfController],
  providers: [AppService, TsfService],
})
export class AppModule {}
