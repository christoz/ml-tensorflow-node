import * as tf from '@tensorflow/tfjs-node';

export default function getModel(numberOfClasses) {
  const model = tf.sequential({
    layers: [
      tf.layers.flatten({inputShape: [7, 7, 256]}),

      tf.layers.dense({
        units: 100,
        activation: 'relu',
        kernelInitializer: 'varianceScaling',
        useBias: true,
      }),
      tf.layers.dense({
        units: numberOfClasses,
        kernelInitializer: 'varianceScaling',
        useBias: false,
        activation: 'softmax',
      }),
    ],
  });

  model.compile({
    optimizer: tf.train.adam(0.0001),
    loss: 'categoricalCrossentropy',
    metrics: ['accuracy'],
  });

  return model;
}
