import { Injectable, OnModuleInit } from '@nestjs/common';
import * as ort from "onnxruntime-node";
import { join } from 'path';
import * as fs from 'fs';

@Injectable()
export class TsfService implements OnModuleInit{
    private session: ort.InferenceSession;
    private minValue: number;
    private maxValue: number;
    private featureRange: [number, number] = [0, 1];

    onModuleInit() {
        this.loadModel()
    }

    inverseTransform (scaledValue):number{
      const [min_range, max_range] = this.featureRange;
      return (scaledValue - min_range) / (max_range - min_range) * 
             (this.maxValue - this.minValue) + this.minValue;
    }

    async loadModel() {
        try {
          this.session = await ort.InferenceSession.create("src/SavedModels/model.onnx");
          const scalerPath = join(__dirname, '../../src/SavedModels/scaler_params.json');
          const scalerData = JSON.parse(fs.readFileSync(scalerPath, 'utf-8'));

          this.minValue = scalerData.data_min_[0];
          this.maxValue = this.minValue + scalerData.data_range_[0];
        } catch (error) {
          console.error("Error loading ONNX model:", error);
        }
      }


    async predict(lastSequence:number[][]): Promise<number[]>{
        if (!this.session) {
            throw new Error("ONNX Model not loaded.");
          }
      
          const forecasting = [];
      
          for (let i = 0; i < 12; i++) {
            const inputTensor = new ort.Tensor('float32', new Float32Array(lastSequence.flat()), [1, 12, lastSequence[0].length]);
      
            const results = await this.session.run({ "input_1" : inputTensor });

            const scaledPrediction = results.dense.cpuData[0]
            const prediction = this.inverseTransform(scaledPrediction)
      
            forecasting.push(prediction);
            lastSequence.shift();
            lastSequence.push([prediction, ...lastSequence[lastSequence.length - 1].slice(1)]);
          }
          return forecasting
    }

}
