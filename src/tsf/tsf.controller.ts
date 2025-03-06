import { Controller, Get, OnModuleInit, Post } from '@nestjs/common';
import { TsfService } from './tsf.service';
import * as fs from 'fs';
import * as path from 'path';
import * as csv from 'csv-parser';

@Controller()
export class TsfController implements OnModuleInit{
private dataset: any[] = [];

constructor(private readonly tsfService:TsfService){}

onModuleInit() {
    const datasetPath = path.join(__dirname, '..','..','recurrent_neural_network', 'RNN_Preprocessed_Dataset.csv');

    fs.createReadStream(datasetPath)
      .pipe(csv())
      .on('data', (row) => this.dataset.push(row))
      .on('end', () => console.log('Dataset loaded successfully!'));
  }



        @Get("forecast")
        forecastPrediction():number{

            return 0;
        }
    
}
