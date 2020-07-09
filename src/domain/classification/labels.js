/* eslint-disable no-plusplus */
import * as tf from '@tensorflow/tfjs-node';

export function oneHot(labelIndex, classLength) {
  return tf.tidy(() => tf.oneHot(tf.tensor1d([labelIndex]).toInt(), classLength));
}

export function getAsObject(labels) {
  const labelObject = {};
  for (let i = 0; i < labels.length; i++) {
    const label = labels[i];
    if (labelObject[label] === undefined) {
      // only assign it if we haven't seen it before
      labelObject[label] = Object.keys(labelObject).length;
    }
  }
  return labelObject;
}

export function add(labels) {
  return tf.tidy(() => {
    const classes = getAsObject(labels);
    const classLength = Object.keys(classes).length;

    let ys;
    for (let i = 0; i < labels.length; i++) {
      const label = labels[i];
      const labelIndex = classes[label];
      const y = oneHot(labelIndex, classLength);

      if (i === 0) {
        ys = y;
      } else {
        ys = ys.concat(y, 0);
      }
    }

    return ys;
  });
}
