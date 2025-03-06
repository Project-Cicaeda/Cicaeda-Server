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




}
