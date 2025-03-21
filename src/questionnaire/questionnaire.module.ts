import { SaveResult, SaveResultSchema } from 'src/schemas/result.schema';
import { QuestionnaireController } from '../questionnaire/ques.controller';
import { QuestionnaireService } from '../questionnaire/ques.service';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ResultModule } from 'src/result/result.module';
import { ResultService } from '../result/result.service';
import { User, UserSchema } from 'src/schemas/user.schema';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: SaveResult.name, schema: SaveResultSchema }]),     
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),    
        ResultModule,
    ],
    controllers: [QuestionnaireController],
    providers: [QuestionnaireService],  

})
export class QuestionnaireModule{}

