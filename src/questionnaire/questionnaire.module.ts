import { SaveResult, SaveResultSchema } from 'src/schemas/result.schema';
import { QuestionnaireController } from '../questionnaire/ques.controller';
import { QuestionnaireService } from '../questionnaire/ques.service';
import { QuestionnaireResult, QuesResultSchema } from '../schemas/ques.schema';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ResultModule } from 'src/result/result.module';

@Module({
    imports: [
        MongooseModule.forFeature([{name: SaveResult.name, schema: SaveResultSchema}]),
        ResultModule,
    ],
    controllers: [QuestionnaireController],
    providers: [QuestionnaireService]  
})

export class QuestionnaireModule{}