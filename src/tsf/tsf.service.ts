import { Injectable, OnModuleInit } from '@nestjs/common';
import * as ort from "onnxruntime-node";
import { join } from 'path';

@Injectable()
export class TsfService implements OnModuleInit{
    private session: ort.InferenceSession;

    onModuleInit() {
        this.loadModel()
    }

    async loadModel() {
        try {
          this.session = await ort.InferenceSession.create("src/SavedModels/model.onnx");
          console.log(this.session.inputNames);
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
            console.log(results.dense.cpuData[0])
            const prediction = results.dense.cpuData[0];
      
            forecasting.push(prediction);
            lastSequence.shift();
            lastSequence.push([prediction, ...lastSequence[lastSequence.length - 1].slice(1)]);
          }
          return forecasting
    }

}
