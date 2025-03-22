// import * as ort from 'onnxruntime-node';

// jest.mock('onnxruntime-node', () => ({
//   InferenceSession: {
//     create: jest.fn().mockResolvedValue({
//       run: jest.fn().mockResolvedValue({
//         output: new Float32Array([
//           499,
//           440,
//           359,
//           285,
//           230,
//           196,
//           177,
//           168,
//           162,
//           159,
//           155,
//           152
//         ]),
//       }),
//     }),
//   },
//   Tensor: {
//     from: jest.fn((type: string, data: Float32Array, dims: number[]) => ({ type, data, dims })),
//   },
// }));


// describe('TsfService', () => {
//   let session: ort.InferenceSession;

//   beforeAll(async () => {
//     session = await ort.InferenceSession.create('model.onnx');
//   });

//   it('should load the ONNX model on module initialization', async () => {
//     expect(session).toBeDefined();
//   });

//   it('should make a prediction using the ONNX model with specific input', async () => {
//     // Define the specific (12, 26) input tensor
//     const inputData = {
//       data:  ort.Tensor.from(
//         'float32',
//         new Float32Array([
//           ...Array(12).fill([
//             0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
//           ]).flat()
//         ]),
//         [12, 26]
//       ),
//     };


//     const result = await session.run(inputData);
//     expect(session.run).toHaveBeenCalled();
//     expect(result.output).toBeInstanceOf(Float32Array);
//     expect(Array.from(result.output)).toEqual([
//       499,
//       440,
//       359,
//       285,
//       230,
//       196,
//       177,
//       168,
//       162,
//       159,
//       155,
//       152
//     ]);
//   });

//   it('should throw an error if the model is not loaded', async () => {
//     jest.spyOn(ort.InferenceSession, 'create').mockRejectedValue(new Error('Model load failed'));

//     await expect(ort.InferenceSession.create('invalid_model.onnx')).rejects.toThrow('Model load failed');
//   });
// });
