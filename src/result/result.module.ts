import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ResultSchema, SaveResult } from "src/schemas/result.schema";
import { resultController } from "./result.controller";
import { ResultService } from "./result.service";


@Module({
    imports: [
        MongooseModule.forFeature([{name: SaveResult.name, schema: ResultSchema}])
    ],
    controllers: [resultController],
    providers : [ResultService],
    exports: [ResultService]
})

export class ResultModule{}