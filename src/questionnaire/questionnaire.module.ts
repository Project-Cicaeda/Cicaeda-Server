import { SaveResult, SaveResultSchema } from 'src/schemas/result.schema';
import { QuestionnaireController } from '../questionnaire/ques.controller';
import { QuestionnaireService } from '../questionnaire/ques.service';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ResultModule } from 'src/result/result.module';
import { ResultService } from 'src/result/result.service';

@Module({
    imports: [
        MongooseModule.forFeature([{name: SaveResult.name, schema: SaveResultSchema}]),
        ResultModule,
    ],
    controllers: [QuestionnaireController],
    providers: [QuestionnaireService, ResultService],  

})
export class QuestionnaireModule{}

