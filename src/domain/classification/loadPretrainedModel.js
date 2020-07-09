import * as tf from '@tensorflow/tfjs-node';

const URL = 'https://storage.googleapis.com/tfjs-models/tfjs/mobilenet_v1_0.25_224/model.json';

const MobileNet = {
  url: URL,
};

export default async function loadPretrainedModel() {
  const pretrainedModel = await tf.loadLayersModel(MobileNet.url);

  const layer = pretrainedModel.getLayer('conv_pw_13_relu');

  return tf.model({
    inputs: pretrainedModel.inputs,
    outputs: layer.output,
  });
}
