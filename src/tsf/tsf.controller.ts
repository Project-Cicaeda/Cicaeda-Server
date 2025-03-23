import { Controller, Get, OnModuleInit, Post, Query } from '@nestjs/common';
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
  }

        @Get("forecast")
        forecastPrediction(@Query('city') city:string): Promise<number[]>{
            const cityData =  this.dataset.filter((row) => row.City === city);
            const lastSequence = cityData
            .slice(-12) 
            .map((row) => {
                const { Date, City, Value, ...features } = row; 
                return Object.values(features).map(Number);
            });

              
            const forecasting = this.tsfService.predict(lastSequence)
            return forecasting;
        }
    
}
