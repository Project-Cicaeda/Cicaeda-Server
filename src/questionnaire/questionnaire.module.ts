// import { SaveResult, SaveResultSchema } from 'src/schemas/result.schema';
import { QuestionnaireController } from '../questionnaire/ques.controller';
import { QuestionnaireService } from '../questionnaire/ques.service';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
// import { ResultModule } from 'src/result/result.module';

@Module({
    imports: [
        MongooseModule.forFeature([/*{name: SaveResult.name, schema: SaveResultSchema},*/
            {name: QuestionnaireResult.name, schema: QuesResultSchema}
        ]),
        // ResultModule,
      
    ],
    controllers: [QuestionnaireController],
    providers: [QuestionnaireService, ResultService],  

})
export class QuestionnaireModule{}

