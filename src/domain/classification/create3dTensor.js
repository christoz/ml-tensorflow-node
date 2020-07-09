import * as tf from '@tensorflow/tfjs-node';

function cropTensorImage(tensor) {
  const width = tensor.shape[0];
  const height = tensor.shape[1];

  // use the shorter side as the size to which we will crop
  const shorterSide = Math.min(tensor.shape[0], tensor.shape[1]);

  // calculate beginning and ending crop points
  const startingHeight = (height - shorterSide) / 2;
  const startingWidth = (width - shorterSide) / 2;
  const endingHeight = startingHeight + shorterSide;
  const endingWidth = startingWidth + shorterSide;

  // return image data cropped to those points
  return tensor.slice([startingWidth, startingHeight, 0], [endingWidth, endingHeight, 3]);
}

function resizeTensor(tensor) {
  // TODO: might need to use resizeNearestNeighbor
  return tf.image.resizeBilinear(tensor, [224, 224]);
}

function batchTensor(tensor) {
  // Expand our tensor to have an additional dimension, whose size is 1
  const batchedTensor = tensor.expandDims(0);

  // Turn pixel data into a float between -1 and 1.
  return batchedTensor.toFloat().div(tf.scalar(127)).sub(tf.scalar(1));
}

export default function create3dTensor(buffer) {
  const tensor = tf.node.decodeJpeg(buffer);
  const croppedTensor = cropTensorImage(tensor);
  const rezisedTensor = resizeTensor(croppedTensor);
  const batchedTensor = batchTensor(rezisedTensor);

  return batchedTensor;
}
